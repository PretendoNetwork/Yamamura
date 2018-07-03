# 
# core/db.py - database utilities
# 
# author: superwhiskers
# license: gplv3 
#
# import things
import core.utils as utils  # import the utility module
import dataset  # modmail has never looked this good


# 
# TODO: finish tags class
# 
# the modmail class, should make programming easier for
# you devs :)
class Modmail:
    """
    a class that makes per-server modmail possible, and easier
    """

    # initiation function
    def __init__(self, server_object):
        """
        initiates the modmail class
        :argument server_object: a discord.Guild
        """
        # set some variables to save these
        self.db = dataset.connect(
            f"servers/{ server_object.id }/server.db"  # open a connection to the server database
        )
        self.settings = utils.KeyValueTable(self.db["settings"])  # get the settings table as a key-value store
        self.modmail = self.db["modmail"]  # get the modmail table
        self.log = utils.Logger(
            f"db::mail ({ server_object.id }/{ server_object.name })",
            f"servers/{ server_object.id }/db_modmail.log",
        )
        # notify the sysadmin of the connection
        self.log(f"connected to { server_object.id }/{ server_object.name }")
        # display the current number of stored message
        self.log(f"current number of messages in database: { len(self.db['mail']) }")
        # finish it...
        self.log(f"finished loading...")

    # parse modmail to text
    # this function doesn't change much
    @staticmethod
    def parse(mail):
        """
        parses a mail dict. intended to be used by the modmail class but may have other uses.
        :argument mail: a mail dict
        """
        # parse a list of mail
        if isinstance(mail, list):
            # the string to send to Discord
            return_string = f"""mail from { self.server.id }/{ self.server.name }:
"""
            # loop through the mail list
            for x in range(0, len(mail)):
                # append the parsed message to the string
                return_string += f"""
{ mail[x]["id"] } - sent by { mail["sender_id"] }/{ mail["sender_name"] }```
{ mail[x]["message"] }```
"""
            # return the string
            return return_string

        # parse only a single message
        else:
            # the string to send to Discord
            return_string = f"""
{ mail["id"] } - sent by { mail["sender_id"] }/{ mail["sender_name"] }```
{ mail["message"] }```

"""
            # return the parsed message
            return return_string

    # get the current modmail
    def read(self, mod):
        """
        returns a string of mail ready for sending to discord
        :argument mod: a discord.Member of a mod
        :returns: a string of mail ready to send to discord
        """
        # tell the sysadmin that we're reading mail for a mod
        self.log(f"reading mail for { mod.id }/{ mod.name }")
        # the unread mail list
        unread = []
        # add all of the unread mail
        for mail in self.modmail:
            try:
                mail["readBy"].index(mod.id)
            except ValueError:
                unread.append(mail)
                mail["readBy"].append(mod.id)
        # if no mail is unread
        if not unread:
            return None

        # return the unread mail
        return self.parse(unread)

    # send modmail
    def send(self, msg, sender):
        """
        send mail to mods
        :argument msg: a string to send as a message
        :argument sender: a discord.Member for the sender
        """
        # tell the sysadmin that someone is sending mail
        self.log(f"{ sender.id }/{ sender.name } is sending modmail")
        # construct the message
        mail_to_send = dict(
            id=utils.whiskerflake(), sender_id=sender.id, sender_name=sender.name, message=msg, readBy=[]
        )
        # send the message
        self.modmail.insert(mail_to_send)
        # tell the sysadmin the current number of messages in the db
        self.log(f"{ sender.id }/{ sender.name }'s mail has been sent")
        self.log(f"current number of messages: { len(self.db['mail']) }")
        # exit the function
        return

    # clean mail
    def clean(self):
        """
        wipe all mail that has been read by all of the mods. takes no arguments
        """
        # tell the sysadmin that the mail is being cleaned
        self.log(f"cleaning mail...")
        # list of moderator's ids
        mods = self.settings["mod_ids"]
        # indexes of mail to delete
        indexes_to_delete = []
        # check if all the mods have read the mail
        for mail in self.modmail:
            mail_read = True
            for y in range(0, len(mods)):
                try:
                    mail["readBy"].index(mods[y])
                except ValueError:
                    mail_read = False
            if mail_read:
                indexes_to_delete.append(self.modmail.find(id=mail["id"]))
        # then clean from the mail list the indexes to delete
        for x in range(0, len(indexes_to_delete)):
            self.modmail.delete(id=x)
        # return with nothing
        return

    # delete a specific message
    def delete(self, sid):
        """
        deletes a specific message by it's identifier. takes one argument, an identifier. returns none if not found,
        true if it was
        """
        # tell the sysadmin that mail is being deleted
        self.log(f"searching for mail id { sid }...")
        # search the mail for a specific id
        if self.modmail.find_one(id=sid):
            self.modmail.delete(id=mail["id"])
            return True
        # if we could not find this, then tell the sysadmin this too
        self.log(f"could not find mail id { sid }...")
        # then return none because nothing was found
        return None

    # shows all mail
    def list(self):
        """
        lists all mail in the database. returns a parsed version of all of the mail
        """
        # tell the sysadmin **everything**
        self.log(f"listing all mail to someone...")
        # this might happen
        if not self.modmail.all():
            return None
        # the mail
        return self.parse(self.modmail.all())

    # read a specific message
    def read_single(self, sid):
        """
        read a specific message. takes one argument, an identifier for a message. returns none if not found, otherwise,
        it returns the message
        """
        # might be useful for statistics or something
        self.log(f"searching for mail id { sid }...")
        # find the message
        message = self.modmail.find_one(id=sid)
        # check if we found it
        if message:
            # return the message
            return self.parse(message)
        # debugging???
        self.log(f" could not find mail id { sid }...")
        # return None if not found
        return None


"""
# tag class for Netux's tags
class Tags:
    ""
    class for handling the tags system
    ""

    def __init__(self, serverInfo):
        ""
        initiates the tags class. takes one argument, a serverinfo dict (doc.py #1)
        ""
        # set some variables to save these
        self.server = serverInfo  # server info, from a YAML file
        self.db = dataset.connect(
            self.server["dbPath"]  # the sqlite3 database object for the server
        )
        self.log = utils.Logger(
            f"db::tags ({ self.server['dbName'] })",
            f"{ self.server['rootDir'] }/db_tags.log",
        )
        # notify the sysadmin of the connection
        self.log(f"connected to { self.server['dbName'] }")
        # finish it...
        self.log(f"finished loading...")

    # get the tags, all of them
    @staticmethod
    def get_tags():
        with open("tags.json", "r") as tags_file:
            return json.load(tags_file)

    # get a specific tag by name
    def get_tag(tag_name):
        tags = get_tags()
        for name, tag in tags.items():
            if name == tag_name:
                return tag

        return None

    # create a tag
    def create_tag(name, content):
        tags = get_tags()
        tags[
            name
        ] = {
            # support for future additions
            'content': content
        }
        save_tags(tags)

    # delete a tag
    def delete_tag(name):
        tags = get_tags()
        del tags[name]
        save_tags(tags)

    def save_tags(tags):
        with open("tags.json", "w") as tags_file:
            tags_file.seek(0)
            tags_file.write(json.dumps(tags))
            tags_file.truncate()
"""