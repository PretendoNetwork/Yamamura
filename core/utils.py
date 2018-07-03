# 
# core/utils.py - utilities for yama to use
# 
# author: superwhiskers
# license: gplv3 
#
# imported modules
import time  # getting seconds since epoch
import random  # random number generation
import datetime  # easier method of getting timestamps


# an extremely nice logging class, useful for
# making logs consistent across modules
class Logger:
    """
    a class for unifying logs across parts of yamamura
    """

    # initiate a logger
    def __init__(self, module, output_file):
        """
        initiates a Logger class
        :param module: a unique name to be used for your module
        :param output_file: the file to output your module's logs
        """
        # initiate some variables
        self.module = module  # module name
        self.file = output_file  # output file

    # when the class is called
    def __call__(self, message):
        """
        prints out a log message to the console with the module name, and the current time and date
        :param message: the message to log
        """
        # construct a safe string
        printable = f"[yamamura::{ self.module }]: { message } [{ datetime.datetime.utcnow() }]"
        # print it
        print(printable)
        # output to a file, too
        with open(self.file, "a", -1, "utf-8-sig") as output:
            output.write(printable + "\n")


# generate a unique identifier extremely quickly
def whiskerflake():
    """
    generate a uuid-like construct fairly quickly
    :returns: it returns a whiskerflake
    """
    # generate a list of 10 4-digit integers, and select one
    rand_int = str(
        hash(abs(random.choice([random.randint(1000, 9999) for _ in range(10)])))
    )
    # generate a hash of the seconds since epoch
    epoch_hash = str(hash(time.time()))
    # add them and return
    return epoch_hash + rand_int


# check for list overlap between two lists
def list_overlap(list1, list2):
    """
    check if anything in list1 matches anything in list2
    :param list1: a list
    :param list2: another list
    :returns: true if there is overlap, false if there is none
    """
    # variable to tell if there is overlap
    overlap = False
    # loop over list1
    for item in list1:
        if item in list2:
            overlap = True
            break
    # return if there is overlap
    return overlap


# class to make a database table like a key-value store
class KeyValueTable:
    """operate a database table like a key-value store"""

    # initiate the KeyValueDB
    def __init__(self, table):
        """
        initiate the KeyValueDB
        :param table: a dataset table
        """
        self.table = table

    # retrieve a key-value pair from the database
    def __getitem__(self, key):
        """
        retrieve an item from the key-value store
        :param key: the name of the requested item
        :return: the requested item
        :raises KeyError: it raises KeyError if it cannot be found
        """
        # attempt to find the requested item
        res = self.table.find_one(key=key)
        # check if it returned something
        if not res:
            # raise IndexError if it cannot be found
            raise KeyError(f"unable to find key-value pair with key { key }")
        else:
            # otherwise return the requested item
            return res

    # set a key-value pair in the database
    def __setitem__(self, key, value):
        """
        set an item in the key-value store
        :param key: the key to set
        :param value: the value for the key to have
        """
        # upsert it (insert if it doesn't exist, update it if it does)
        self.table.upsert(dict(key=key, value=value), ["key"])

    # delete a key-value pair in the database
    def __delitem__(self, key):
        """
        delete a value in the key-value store if it exists
        :param key: the key to delete
        """
        # attempt to delete it
        self.table.delete(key=key)

    # when the key is missing
    def __missing__(self, key):
        # just return none
        return None


"""
def coo(channel, target_user, response):
    target_part = f"{ target_user.mention }, " if target_user is not None else ""
    return channel.send(f"Coo, { target_part }{ response }")
"""
