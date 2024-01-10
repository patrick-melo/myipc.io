#+       debug [command]
#+              Debug a g command.
#+
cmd_debug() { bash -x $THIS "$@" ; }