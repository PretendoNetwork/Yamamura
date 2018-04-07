# 
# core/utils.py - utilities for yama to use
# 
# author: superwhiskers
# license: gplv3 
#
# imported modules
import string  # string utilities
import time  # getting seconds since epoch
import random  # random number generation
import datetime  # easier method of getting timestamps


# an extremely nice logging class, useful for
# making logs consistent across modules
class logger:
    """a class for unifying logs accross parts of yamamura"""

    # initiate a logger
    def __init__(self, module, ofile):
        """initiates a logger class. expects a string as a module name"""
        # initiate some variables
        self.module = module  # module name
        self.file = ofile  # output file

    # when the class is called
    def __call__(self, message):
        """prints out a log message to the console with the module name, and the current time and date"""
        # construct a safe string
        printable = f"[yamamura::{ self.module }]: { message } [{ datetime.datetime.utcnow() }]"
        # print it
        print(printable)
        # output to a file, too
        with open(self.file, "a", -1, "utf-8-sig") as output:
            output.write(printable + "\n")


# generate a unique identifier extremely quickly
def whiskerflake():
    """generate a uuid-like construct fairly quickly"""
    # generate a list of 10 4-digit integers, and select one
    randInt = str(
        hash(abs(random.choice([random.randint(1000, 9999) for _ in range(10)])))
    )
    # generate a hash of the seconds since epoch
    epochHash = str(hash(time.time()))
    # add them and return
    return (epochHash + randInt)

"""
def coo(channel, target_user, response):
    target_part = f"{ target_user.mention }, " if target_user is not None else ""
    return channel.send(f"Coo, { target_part }{ response }")
"""
