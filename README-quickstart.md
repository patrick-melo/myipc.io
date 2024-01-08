# Docker

The server will be running on http://localhost. 

Run these commands to start the server:

    git clone git@github.com:patrick-melo/myipc.git
    cd myipc.io
    docker-compose up

# M command
You can add an alias to the following to ~/.zshrc.
You will need to start a new terminal window for the changes to take effect.

    alias m=~/eclipse-workspace/myipc.io/bin/m.sh

# Sprites
To rebuild the sprites, you will need the M command (see above).

Run the following command to rebuild the sprites:

    m init sprites

## Development
To rebuild the sprites, you will need the M command (see above).

When the server is built, it copies the source files into the docker image.
To get the server to use the files in the repo instead, do the following

1. Stop the container (the one that was started with `docker-compose up`)
2. Uncomment the following lines  in `docker-compose.yml`:

        volumes:
            - .:/usr/app

            START_COMMAND: "sleep 99999"

3. Start the container (`docker-compose up`)

4. Run the following command to initialize react outside the container.

    m init react

5. Comment the following line in docker-compose.yml

            START_COMMAND: "sleep 99999"

6. Stop and start the container.
