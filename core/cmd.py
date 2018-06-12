# 
# core/cmd.py - command handling utilities
# 
# author: superwhiskers
# license: gplv3 
#
"""
original method:

```
# checks if a command is at the start of a message
def command(command, msg):
    return re.match(
        "^" + cfg["prefix"] + command + "(?:\\s+|$)", msg, re.MULTILINE
    )
```

"""
"""
my plan for this...

using decorators (you know, things like what will be shown below)

```
@cmd.set("<name>")
def __command(context, **kwargs):
    # place some command handling stuff here
    if "hai" in context.raw_message:
        await msg.channel.send("halloooo")
        return
    # i have no clue
    msg.channel.send("hello from yamamura, superwhiskers' magnum opus")
```

i will basically write a framework for easier command handling

so, using the above example, if a user said this

```
y~<name>
```

that would trigger this

```
hello from yamamura, superwhiskers' magnum opus
```

but...
how about this?

```
y~<name> hai
```

that would trigger this

```
halloooo
```

the point of this is to allow the developer more fine-grained
control over the sent messages, without sacrificing ease-of-use

"""
