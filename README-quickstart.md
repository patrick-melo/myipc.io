# Docker Quickstart
The server will be running on http://localhost. 

Run these commands to start the server:

    git clone git@github.com:patrick-melo/myipc.git
    cd myipc.io
    docker-compose up

# Sprites

To rebuild the sprites, use the m command.
You can add an alias to the following to ~/.zshrc.
You will need to start a new terminal window for the changes to take effect.

    alias m=~/eclipse-workspace/myipc.io/bin/m.sh

Run the following command to rebuild the sprites:

    m init sprites

