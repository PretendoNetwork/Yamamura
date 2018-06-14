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

"""
def coo(channel, target_user, response):
    target_part = f"{ target_user.mention }, " if target_user is not None else ""
    return channel.send(f"Coo, { target_part }{ response }")
"""
