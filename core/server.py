#
# core/server.py - well, things for handling the discord servers
# 
# author: superwhiskers
# license: gplv3 
#

# imported modules
import utils # utilities for logging and stuff

# the server class
class server:
    """a class for dealing with server data"""

    # initiation function
    def __init__(self, serverInfo, serverObj):
        """initiates the server class. takes two arguments, a serverinfo dict (doc.py #1), and a discord.py server object"""
        # set some variables to save these
        self.serverInfo = serverInfo  # server info, from a YAML file
        self.server = serverObj # the server object
        self.log = utils.logger(f"db::mail { self.server['dbName'] }", f"{ self.server['rootDir'] }/server.log")
        # 