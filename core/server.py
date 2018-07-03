#
# core/server.py - well, things for handling the discord servers
#
# author: superwhiskers
# license: gplv3
#
# imported modules
import core.utils as utils  # import the utility package
import dataset  # database things
import discord  # dealing with some discord-related things


# the server class
# "it's really just another helper class"
class Server:
    """
    a class for dealing with server data. makes looking up users and roles and things easier
    """

    # initiation function
    def __init__(self, server_object):
        """
        initiates the server class
        :param server_object: a discord.Guild class
        """
        # set some variables to save these
        self.db = dataset.connect(
            f"servers/{ server_object.id }/server.db"  # the database
        )
        self.server_settings = utils.KeyValueTable(self.db["settings"])
        self.server = server_object  # the server object
        self.log = utils.Logger(
            f"utils::server ({ self.server.id }/{ self.server.name })",
            f"servers/{ self.server.id }/server.log",
        )
        # check if the server object is actually a server object
        if type(self.server) != discord.Guild:
            self.log(
                f"the { type(self.server) } type is not of the discord.Guild class. i suggest you go fix that"
            )
            raise TypeError(
                f"the { type(self.server) } type is not of the discord.Guild class. i suggest you go fix that"
            )

        # add a nice log message
        self.log(f"initiated server class for { self.server.id }/{ self.server.name }")

    # checking if a member is a mod
    def is_mod(self, member):
        """
        returns true if user is a mod, false if they aren't
        :param member: a discord.Member to check for mod status on
        :returns: it returns true if the user is a mod, false if they aren't. it returns none if a type mismatch occurred
        """
        # check if they are an instance of discord.Member
        if type(member) != discord.Member:
            return None
        # place the ids of each of the member's roles into a list
        user_role_ids = []
        # loop over the roles
        for role in member.roles:
            # append the id
            user_role_ids.append(str(role.id))
        # do the check
        return member.id in self.server_settings["mods"] or utils.list_overlap(
            self.server_settings["mod_roles"], user_role_ids
        )

    # get a channel by an identifier
    def text_channel(self, query):
        """
        returns a discord channel object that is looked up by name or id
        :param query: a channel name or id to look up. note that the id must be an int if it is one
        :returns: a discord.TextChannel with the name or id specified. it can also return None if the search method is invalid
        """
        # attempt to identify what the query is
        if type(query) == int:
            return discord.utils.get(self.server.channels, id=query)

        elif type(query) == str:
            return discord.utils.get(self.server.channels, name=query)

        # otherwise, just return none because it isn't a valid search method
        return None

    # get a voice channel by an identifier
    def voice_channel(self, query):
        """
        returns a discord voice channel object that is looked up by name or id
        :param query: a voice channel name or id to look up. note that the id must be an int if it is one
        :returns: a discord.VoiceChannel with the name or id specified. it can also return None if the search method is invalid
        """
        # attempt to identify what the query is
        if type(query) == int:
            return discord.utils.get(self.server.voice_channels, id=query)

        elif type(query) == str:
            return discord.utils.get(self.server.voice_channels, name=query)

        # otherwise, just return none because it isn't a valid search method
        return None

    # get a role by an identifier
    def role(self, query):
        """
        returns a discord role object that is looked up by name or id
        :param query: a role name or id to look up. note that the id must be an int if it is one
        :returns: a discord.Role with the name or id specified. it can also return None if the search method is invalid
        """
        # attempt to identify what the query is
        if type(query) == int:
            return discord.utils.get(self.server.roles, id=query)

        elif type(query) == str:
            return discord.utils.get(self.server.roles, name=query)

        # otherwise, just return none because it isn't identifiable
        return None

    # get a user by an identifier
    def user(self, query):
        """
        returns a discord member object that is looked up by name or id
        :param query: a member name or id to look up. note that the id must be an int if it is one
        :returns: a discord.Member with the name or id specified. it can also return None if the search method is invalid
        """
        # attempt to identify what the query is
        if type(query) == int:
            return discord.utils.get(self.server.members, id=query)

        elif type(query) == str:
            return discord.utils.get(self.server.members, name=query)

        # otherwise, just return none because it isn't identifiable
        return None

    # check if a member has a role
    def has_role(self, member, role):
        """
        return if a member has a role
        :param member: a discord role obj or an discord role id. the member id must be of the int type
        :param role: a discord member obj or an discord member id. the member id must be of the int type here too
        :returns: it returns none if a type mismatch occurred, otherwise it returns true or false if they have it or not
        """
        # first, check if the passed role is a discord role object
        # or a role id (int)
        # role object
        if type(role) != discord.role.Role:
            # role id (int)
            if type(role) != int:
                # return None because they should do this correctly
                return None

            else:
                # get the role by the id
                role = self.role(role)
        # now test if the member is correct
        # member object
        if type(member) != discord.member.Member:
            # member id (int)
            if type(member) != int:
                # i guess it's neither
                return None

            else:
                # get the member by id
                member = self.user(member)
        # everything is now a-okay!
        # variable for checking if they have it
        has_role = False
        # search for it on the member
        for x in range(0, len(member.roles)):
            # compare ids
            if role.id == member.roles[x].id:
                # if they are the same, they have it!
                has_role = True
        # return the result
        return has_role
