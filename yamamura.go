/*

yamamura - that one discord bot used in the pretendo discord serverOB
Copyright (C) 2018 superwhiskers <whiskerdev@protonmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

*/

package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"os/signal"
	"regexp"
	"runtime"
	"strings"
	"syscall"
	"time"

	"github.com/bwmarrin/discordgo"
	log "github.com/sirupsen/logrus"
	"github.com/superwhiskers/harmony"
	"github.com/superwhiskers/fennel"
)

type configType struct {
	Token          string   `json:"token"`
	Prefix         string   `json:"prefix"`
	Moderators     []string `json:"moderators"`
	SpamChannels   []string `json:"spam_channels"`
	VotingChannels []string `json:"voting_channels"`
}

var (
	config       configType
	handler      *harmony.CommandHandler
	mentionRegex *regexp.Regexp
	ayyRegex     *regexp.Regexp
	nintyClient  *fennel.AccountServerClient
)

func init() {

	log.SetOutput(os.Stdout)
	log.SetFormatter(&log.TextFormatter{
		DisableColors: true,
	})

}

func main() {

	runtime.GOMAXPROCS(100)

	logfile, err := os.OpenFile("yamamura.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {

		log.Warnf("unable to open logfile. falling back to stdout only. error: %v", err)

	} else {

		defer logfile.Close()
		log.SetOutput(io.MultiWriter(os.Stdout, logfile))

	}

	configByte, err := ioutil.ReadFile("config.json")
	if err != nil {

		log.Panicf("unable to read config file. error: %v", err)

	}

	err = json.Unmarshal(configByte, &config)
	if err != nil {

		log.Panicf("unable to parse config file. error: %v", err)

	}

	var clientInfo = fennel.ClientInformation{
		ClientID:     "ea25c66c26b403376b4c5ed94ab9cdea",
		ClientSecret: "d137be62cb6a2b831cad8c013b92fb55",
		DeviceCert:   "",
		Environment:  "",
		Country:      "US",
		Region:       "2",
		SysVersion:   "1111",
		Serial:       "1",
		DeviceID:     "1",
		DeviceType:   "",
		PlatformID:   "1",
	}

	nintyClient, err = fennel.NewAccountServerClient("https://account.pretendo.cc/v1/api", "keypair/ctr-common-cert.pem", "keypair/ctr-common-key.pem", clientInfo)
	if err != nil {

		log.Panicf("unable to create fennel nintendo client. error: %v", err)

	}

	dg, err := discordgo.New(fmt.Sprintf("Bot %s", config.Token))
	if err != nil {

		log.Panicf("unable to create a discordgo session object. error: %v", err)

	}

	mentionRegex = regexp.MustCompile("(?i)\\@everyone|(?i)\\@here")
	ayyRegex = regexp.MustCompile("(?i)\\bay{1,}\\b")

	handler = harmony.New(config.Prefix, true)
	handler.OnMessageHandler = onMessage
	handler.AddCommand("help", false, help)
	handler.AddCommand("status", false, status)
	//handler.AddCommand("role", false, roleMeta)

	dg.AddHandler(handler.OnMessage)
	dg.AddHandler(onReady)

	err = dg.Open()
	if err != nil {

		log.Panicf("unable to open the discord session. error: %v", err)

	}

	log.Printf("press ctrl-c to stop the bot...")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc

	dg.Close()

}

// handles message create events
func onMessage(s *discordgo.Session, m *discordgo.MessageCreate) {

	if strings.HasPrefix(m.Content, config.Prefix) {

		return

	}

	if m.Author.Bot == true {

		return

	}

	member, err := s.GuildMember(m.GuildID, m.Author.ID)
	if err != nil {

		log.Errorf("unable to get guild member. error: %v", err)
		return

	}

	content, err := m.ContentWithMoreMentionsReplaced(s)
	if err != nil {

		content = m.ContentWithMentionsReplaced()

	}

	content = mentionRegex.ReplaceAllStringFunc(content, func(in string) string {

		return strings.Join([]string{"<at>", in[1:]}, "")

	})

	if strings.ToLower(content) == "i'm a teapot" {

		for _, roleID := range member.Roles {

			if roleID == "415067373691863040" {

				err = s.GuildMemberRoleRemove(m.GuildID, m.Author.ID, "415067373691863040")
				if err != nil {

					log.Errorf("unable to remove role. error: %v", err)
					_, err = s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
						Title:       "error",
						Description: "sorry, but i was unable to remove your role",
						Color:       0xFFF176,
						Footer: &discordgo.MessageEmbedFooter{
							Text: "built with ❤ by superwhiskers#3210",
						},
					})

					if err != nil {

						log.Errorf("unable to send message. error: %v", err)

					}
					return

				}

				_, err = s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
					Title:       "removed role",
					Description: "you no longer have the real devs role",
					Color:       0xFFF176,
					Footer: &discordgo.MessageEmbedFooter{
						Text: "built with ❤ by superwhiskers#3210",
					},
				})

				if err != nil {

					log.Errorf("unable to send message. error: %v", err)

				}
				return

			}

		}

		err = s.GuildMemberRoleAdd(m.GuildID, m.Author.ID, "415067373691863040")
		if err != nil {

			log.Errorf("unable to add role. error: %v", err)
			_, err = s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
				Title:       "error",
				Description: "sorry, but i was unable to add your role",
				Color:       0xFFF176,
				Footer: &discordgo.MessageEmbedFooter{
					Text: "built with ❤ by superwhiskers#3210",
				},
			})

			if err != nil {

				log.Errorf("unable to send message. error: %v", err)

			}
			return

		}
		return

	}

	if ayyRegex.MatchString(content) {

		lmao := ayyRegex.ReplaceAllStringFunc(content, func(in string) string {

			lmao := strings.Replace(in[1:], "y", "o", -1)
			lmao = strings.Replace(lmao, "Y", "O", -1)
			if in[0] == []byte("a")[0] {

				lmao = strings.Join([]string{"lma", lmao}, "")

			} else {

				lmao = strings.Join([]string{"LMA", lmao}, "")

			}

			return lmao

		})

		if len(lmao) > 2000 {

			_, err := s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
				Title:       "error",
				Description: "sorry, but the resulting message was too long",
				Color:       0xFFF176,
				Footer: &discordgo.MessageEmbedFooter{
					Text: "built with ❤ by superwhiskers#3210",
				},
			})

			if err != nil {

				log.Errorf("unable to send message. error: %v", err)

			}
			return

		}
		
		_, err = s.ChannelMessageSend(m.ChannelID, lmao)
		if err != nil {

			log.Errorf("unable to send message. error: %v", err)

		}
		return

	}

}

// handles the ready event
func onReady(s *discordgo.Session, r *discordgo.Ready) {

	time.Sleep(500 * time.Millisecond)

	log.Printf("logged in as %s on %d servers...", r.User.String(), len(r.Guilds))

}

// command that shows the help message
func help(s *discordgo.Session, m *discordgo.MessageCreate, args []string) {

	_, err := s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
		Title:       "yamamura",
		Description: "the official pretendo discord bot",
		Color:       0xFFF176,
		Fields: []*discordgo.MessageEmbedField{
			{
				Name: "commands",
				Value: `**help**: shows this message
**status**: checks the status of the pretendo servers
**role [toggle <name>|list]**: toggle a role or list the available roles to toggle`,
				Inline: false,
			},
		},
		Footer: &discordgo.MessageEmbedFooter{
			Text: "built with ❤ by superwhiskers#3210",
		},
	})

	if err != nil {

		log.Errorf("unable to send message. error: %v", err)

	}

	return

}

// server status command
func status(s *discordgo.Session, m *discordgo.MessageCreate, args []string) {

	_, _, err := nintyClient.GetEULA("US", "@latest")
	if err != nil {

		// probably offline
		_, err := s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
			Title:       "server status",
			Description: "○ account.pretendo.cc",
			Color:       0xFFF176,
			Footer: &discordgo.MessageEmbedFooter{
				Text: "built with ❤ by superwhiskers#3210",
			},
		})

		if err != nil {

			log.Errorf("unable to send message. error: %v", err)

		}

		return

	}

	_, err = s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
		Title:       "server status",
		Description: "● account.pretendo.cc",
		Color:       0xFFF176,
		Footer: &discordgo.MessageEmbedFooter{
			Text: "built with ❤ by superwhiskers#3210",
		},
	})

	if err != nil {

		log.Errorf("unable to send message. error: %v", err)

	}

}
