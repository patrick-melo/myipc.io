#!/bin/bash
################################################################################
#
#+ M(1)                         Playchemy Scripts                           M(1)
#+ 
#+ NNAAMMEE
#+       m - administer Playchemy with impunity
#+
#+ SSYYNNOOPPSSIISS
#+       m [command] [OPTION]...
#+
#+ DDEESSCCRRIIPPTTIIOONN
#+       M is a script to help with the administration of myipc.io code.
#+
#+ AARRGGUUMMEENNTTSS
#+       If no commands are provided then the usage is displayed. This script
#+       accepts the following commands. Commands containing a † have required
#+       dependencies.
#+
# Use the following as a style guide: https://google.github.io/styleguide/shell.xml
# Use `man ps` as an example for the help command.

dockerid() { echo $(docker ps --format "table {{.ID}}\t{{.Names}}" | awk '$2 ~ /'$1'/ {print $1}') ; }

error() { echo $1 ; exit 1 ; }

realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}" ; }

usage() { echo "Usage: $@" ; exit 1; }

#+       aws          Run an AWS command
#
cmd_aws() { docker run --rm -it -v ~/.aws:/root/.aws --env AWS_PAGER="" amazon/aws-cli "$@" --region=us-west-1 ; }

#+       aws          Run an AWS command
#
cmd_backup() {
    cmd_sh web 'node ipc-backup'
    docker cp myipcio-web-1:/usr/app/backup.json $THIS_DIR/backup.json
}

#+       clean        Remove all the docker images
#
cmd_clean() { docker container rm myipcio-web-1; }

cmd_clean_bang() { docker system prune --all --force; }

#+       clone        Clone the SmallBall repo
#
cmd_clone() { git clone git@github.com:patrick-melo/myipc.git ; }

cmd_commit() { docker commit  -m "Initialized $(date)" myipcio-web-1 myipcio-web-1 ; }

#+       debug        Prefix with this command to display more debug info
#
cmd_debug() { sh -x $THIS "$@" ; }

#+       deploy       Push the code to AWS
#
cmd_deploy() {    
    echo "=> login"
    cmd_login
    [ $? -ne 0 ] && error "login failed"

    echo "=> tag"
    docker tag myipcio-web-1 414221411811.dkr.ecr.us-west-1.amazonaws.com/myipc:latest
    [ $? -ne 0 ] && error "tag failed"
    echo "tag successful"
    
    echo "=> push"
    docker push 414221411811.dkr.ecr.us-west-1.amazonaws.com/myipc:latest
    [ $? -ne 0 ] && error "push failed"
    echo "push successful"

    cmd_restart

    echo "Deploy completed at $(date)"
}

#+       env          Configure the system to run as dev or prd
#
cmd_env() {
    env=$1
    case $env in
    dev) cmd_env_dev ;;
    prd) cmd_env_prd ;;
    *) cmd_sh web 'cat /usr/app/react/src/config.js';
    esac
}

cmd_env_dev() { 
    echo "=> set env to dev"
    cd $THIS_DIR
    docker cp react/src/config.dev.js myipcio-web-1:/usr/app/react/src/config.js
}

cmd_env_prd() { 
    echo "=> set env to prd"
    cd $THIS_DIR
    docker cp react/src/config.prd.js myipcio-web-1:/usr/app/react/src/config.js
}

#+       help         Display help
#
cmd_help() { grep -h "^#+" $THIS | cut -c4- | less -is ; }

cmd_history() { docker history myipcio-web-1 ; }

#+       init         Initialize the web and postgres containers
#
cmd_init() {
    inst=$1
    [ -z "$inst" ] && usage "init ['dev'|'prd']"

    echo "=> init (5m)"
    cmd_env $inst
    cmd_init_web

    #cmd_init_postgres
    #cmd_commit
}

cmd_init_web() {
    echo "=> init web"
    cmd_sh web 'cd react &&\
        npm run build &&\
        mv build/index.html build/main.html &&\
        mkdir build/sprites
    '
}

cmd_init_postgres() {
    echo "=> init postgres"
    cmd_sh postgres 'psql -h localhost -U postgres -d postgres -c "create database myipc"' >/dev/null 2>&1
    cmd_sh web 'node ipc-install'
}


#+       login        Log into AWS
#
cmd_login() { cmd_aws ecr get-login-password --region us-west-1 --profile playchemy | docker login --username AWS --password-stdin 414221411811.dkr.ecr.us-west-1.amazonaws.com ; }

#+       make         User docker to build the dev containers
#
cmd_make() { 
    echo "=> make (1m)"
    cd $THIS_DIR
    docker-compose build
}

#+       open         Open the dev website
#
cmd_open() { 
    case $1 in
    dev) open http://localhost/ ;;
    prd) open http://myipc-prd-880583870.us-west-1.elb.amazonaws.com/2832 ;;
    *) usage "m open ['dev'|'prd']"
    esac
}

#+       psql         Execute sql commands
#
cmd_psql() {
    inst=$1

    case $inst in
    dev) cmd_sh postgres 'psql -h localhost -U postgres -d myipc' ;;
    prd) cmd_sh postgres 'psql -h prd.cfgms5e7dhpc.us-west-1.rds.amazonaws.com -U postgres -d myipc' ;;
    *) usage "m psql ['dev'|'prd']"
    esac
}

#+       pull         Pull the latest code
#
cmd_pull() { cd $THIS_DIR ; git pull ; }

#+       restart      Restart the prd task
#
cmd_restart() { php $THIS_DIR/bin/EcsTaskStopCommand.php prd myipc-prd ; }

#+       run          Run SmallBall
 #
 cmd_run() {
    cd $THIS_DIR
    docker-compose up --remove-orphans
 }

#+       sh           Open a shell on the docker container
#
cmd_sh() {  
    container=$1 ; shift
    [ -z "$container" ] && container=web

    case $container in
        web)   dir=/usr/app ;;
        postgres) dir=/var/lib/postgresql/data ;;
        *) error "invalid container ($container)"
    esac
        
    if [ $# -gt 0 ] ; then 
        docker exec -w $dir -it $(dockerid $container) /bin/bash -c "$@" ;
    else
        docker exec -w $dir -it $(dockerid $container) /bin/bash ;
    fi 
}

#+       source       Edit the source to this script
#
cmd_source() { vi $THIS ; }

cmd_pullfile() {
    file=$1
    [ -z "$file" ] && usage "m pull [file]"

    docker cp myipcio-web-1:/usr/app/$file $THIS_DIR/$file
}

cmd_pushfile() {
    file=$1
    [ -z "$file" ] && usage "m push [file]"

    docker cp $THIS_DIR/$file myipcio-web-1:/usr/app/$file 
}

#+       version      Display the software version
#
cmd_version() { cd $THIS_DIR ; git describe --dirty ; }

#------------------------------------------------------------------------------
main() {
    cmd=$1 ; shift
    case $cmd in
        aws) cmd_aws "$@" ;;
        backup) cmd_backup "$@" ;;
        clean) cmd_clean "$@" ;;
        clean!) cmd_clean_bang "$@" ;;
        clone) cmd_clone "$@" ;;
        commit) cmd_commit "$@" ;;
        debug) cmd_debug "$@" ;;
        deploy|push) cmd_deploy "$@" ;;
        env) cmd_env "$@" ;;
        help) cmd_help "$@" ;;
        history) cmd_history "$@" ;;
        init) cmd_init "$@" ;;
        login) cmd_login "$@" ;;
        make) cmd_make "$@" ;;
        open) cmd_open "$@" ;;
        psql) cmd_psql "$@" ;;
        pull) cmd_pull "$@" ;;
        pullfile) cmd_pullfile "$@" ;;
        pushfile) cmd_pushfile "$@" ;;
        restart) cmd_restart "$@" ;;
        run) cmd_run "$@" ;;
        sh) cmd_sh "$@" ;;
        ssh) cmd_ssh "$@" ;;
        source) cmd_source "$@" ;;
        version) cmd_version "$@" ;;
        *) echo "m [command]" ;;
    esac
}

THIS_DIR=$( cd "$(dirname "$0")" >/dev/null 2>&1 ; cd ../ ; pwd )
THIS=$THIS_DIR/bin/m.sh
main "$@"
