#
# core/db.py - database utilities
# 
# author: superwhiskers
# license: gplv3 
#

# import things
import dataset  # modmail has never looked this good

#
# TODO: finish adding log messages, describe class better
#

#
# modmail class
#
# 

class modmail:
    # initiation function
    def __init__(self, serverInfo):
        # set some variables to save these
        self.server = serverInfo                              # server info, from a YAML file
        self.db =     dataset.connect(self.server["dbPath"])  # the sqlite3 database object for the server
        # notify the sysadmin of the connection
        print(f"[yamamura::db::mail]: connected to { self.server['dbName'] }")
        # display the current number of stored messages
        print(f"[yamamura::db::mail/{ self.server['dbName'] }]: current number of messages: { len(self.db["mail"]) }")
        # finish it...
        print(f"[yamamura::db::mail/{ self.server['dbname'] }]: finished loading...")
    # parse modmail to text
    # this function doesn't change much
    def parseMail(self, mail):
        # parse a list of mail
        if isinstance(mail, list):
            # the string to send to Discord
            retstr = """mail from { self.server }:
"""
            # loop through the mail list
            for x in range(0, len(mail)):
                # append the parsed message to the string
                retstr += f"""
{mail[x]["id"]} - sent by {mail[x]["sender"]}```
{mail[x]["message"]}```
"""
            # return the string
            return retstr
        # parse only a single message
        else:
            # the string to send to Discord
            retstr = f"""
{mail["id"]} - sent by {mail["sender"]}```
{mail["message"]}```

"""
            # return the parsed message
            return retstr
    # get the current modmail
    def readmail(self, mod):
        # tell the sysadmin that we're reading mail for a mod
        print(f"[yamamura::db::mail/{ self.server['dbName'] }]: reading mail for { mod }")
        # the unread mail list
        unread = []
        # add all of the unread mail
        for mail in self.db["mail"]:
            try:
                mail["readBy"].index(mod)
            except ValueError:
                unread.append(mail)
                mail["readBy"].append(mod)
        # if no mail is unread
        if unread == []:
            return None
        # return the unread mail
        return self.parseMail(unread)
    # send modmail
    def sendmail(self, msg, sender):
        # tell the sysadmin that someone is sending mail
        print(f"[yamamura::db::mail/{ self.server['dbName'] }]: { sender } is sending modmail")
        # constructed mail
        mailToSend = {}
        # construct the message
        mailToSend = dict(
            id      = str(hash(time.time())),
            sender  = sender,
            message = msg,
            readBy  = []
        )
        # send the message
        self.db["mail"].insert(mailToSend)
        # tell the sysadmin the current number of messages in the db
        print(f"[yamamura::db::mail/{ self.server['dbName'] }]: { sender }'s mail has been sent")
        print(f"[yamamura::db::mail/{ self.server['dbName'] }]: current number of messages: { len(self.db["mail"]) }")
        # write the mail
        return True
    # clean mail
    def cleanmail(self):
        # list of moderator's usernames
        mods = self.server["mods"]
        # indexes of mail to delete
        indexesToDelete = []
        # check if all the mods have read the mail
        for mail in self.db["mail"]:
            mailRead = True
            for y in range(0, len(mods)):
                try:
                    mail["readBy"].index(mods[y])
                except ValueError:
                    mailRead = False
            if mailRead:
                indexesToDelete.append(self.db["mail"].find(id=mail["id"]))
        # then clean from the mail list the indexes to delete
        for x in range(0, len(indexesToDelete)):
            del self.db["mail"].delete(id=x)
        # return with nothing
        return
    # delete a specific message
    def deletemail(self, sid):
        # search the mail for a specific id
        found = False
        for mail in self.db["mail"]:
            if mail["id"] == sid:
                self.db["mail"].delete(id=mail["id"])
                found = True
        # if we couldn't find the mail
        if not found:
            return None
        # return at the end
        return True
    # shows all mail
    def listall(self):
        # this might happen
        if self.db["mail"].all() == []:
            return None
        # the mail
        return parseMail(mail)
    # read a specific message
    def readsinglemail(self, sid):
        # find the single message
        for mail in self.db["mail"]:
            if mail["id"] == sid:
                message = mail
                return parseMail(message)
        # return None if not found
        return None