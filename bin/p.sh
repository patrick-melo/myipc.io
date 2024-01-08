#!/bin/bash
################################################################################
#
#+ P(1)                          Patrick Scripts                            P(1)
#+ 
#+ NNAAMMEE
#+       p - administer macOS with impunity
#+
#+ SSYYNNOOPPSSIISS
#+       p [command] [OPTION]...
#+
#+ DDEESSCCRRIIPPTTIIOONN
#+       P is a script to with the administration of Mac machines.
#+
#+ AARRGGUUMMEENNTTSS
#+       If no commands are provided then the usage is displayed. This script
#+       accepts the following commands. Commands containing a † have required
#+       dependencies.
#+
# STYLE:
# Use the following as a style guide: https://google.github.io/styleguide/shell.xml
# Use `man man` (which indents 7 spaces) as an example for the help command.

for script in $(dirname $BASH_SOURCE)/includes/*.sh ; do
    . "$script"
done
THIS_DIR=$( cd "$(dirname "$0")" >/dev/null 2>&1 ; cd ../ ; pwd )
THIS=$THIS_DIR/bin/p.sh
main "$@"
