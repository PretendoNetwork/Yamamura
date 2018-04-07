#
# core/server.py - well, things for handling the discord servers
# 
# author: superwhiskers
# license: gplv3 
#

# imported modules
import utils # utilities for logging and stuff
import discord # dealing with some discord-related things

# the server class
# "it's really just another helper class"
class server:
    """a class for dealing with server data"""

    # initiation function
    def __init__(self, serverInfo, serverObj):
        """initiates the server class. takes two arguments, a serverinfo dict (doc.py #1), and a discord.py server object"""
        # set some variables to save these
        self.serverInfo = serverInfo  # server info, from a YAML file
        self.server = serverObj # the server object
        self.log = utils.logger(f"server::server { self.server['dbName'] }", f"{ self.server['rootDir'] }/server.log")
        # check if the server object is actually a server object
        if type(self.server) != discord.guild.Guild:
            self.log(f"{ type(self.server) } is not a discord server object. i suggest you go fix that")
            return None
    # checking if a user is a mod
    def isMod(self, user):
        """returns true if user is a mod, false if they aren't"""
        # do the check
        return user.id in self.serverInfo["mods"]
    # get a channel by an identifier
    def channel(self, query):
        """returns a discord channel object that is looked up by name or id"""
        # attempt to identify what the query is
        if type(query) == int:
            return discord.utils.get(self.server.channels, id=query)
        elif type(query) == str:
            return discord.utils.get(self.server.channels, name=query)
        # otherwise, just return none because it isn't a valid search method
        return None
    # get a role by an identifier
    def role(self, query):
        """return a discord role object that is looked up by name or id"""
        # attempt to identify what the query is
        if type(query) == int:
            return discord.utils.get(self.server.roles, id=query)
        elif type(query) == str:
            return discord.utils.get(self.server.roles, name=query)
        # otherwise, just return none because it isn't identifiable
        return None
    # get a user by an identifier
    def user(self, query):
        """return a discord member object that is looked up by name or id"""
        # attempt to identify what the query is
        if type(query) == int:
            return discord.utils.get(self.server.members, id=query)
        elif type(query) == str:
            return discord.utils.get(self.server.members, name=query)
        # otherwise, just return none because it isn't identifiable
        return None
    # check if a member has a role
    def hasRole(self, member, role):
        """return if member has role. member can be either a discord role obj or an discord role id (int). same goes for role, except replace role obj with member obj"""
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
                # you idiot
                return None
            else:
                # get the member by id
                member = self.user(member)
        # everything is now a-okay!
        # variable for checking if they have it
        hasRole = False
        # search for it on the member
        for x in range(0, len(member.roles)):
            # compare ids
            if role.id == member.roles[x].id:
                # if they are the same, they have it!
                hasRole = True
        # return the result
        return hasRole