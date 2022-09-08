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

#+       clean        Remove all the docker images
#
cmd_clean() { docker system prune --all --force ; }

#+       clone        Clone the SmallBall repo
#
cmd_clone() { git clone git@github.com:patrick-melo/myipc.git ; }

#+       debug        Prefix with this command to display more debug info
#
cmd_debug() { sh -x $THIS "$@" ; }

#+       help         Display help
#
cmd_help() { grep -h "^#+" $THIS | cut -c4- | less -is ; }

cmd_init() {
    echo "=> create database"
    cmd_sh postgres 'psql -h localhost -U postgres -d postgres -c "create database myipc"'
    
    echo "=> populate database (5m / 2831 rows)"
    cmd_sh web 'node ipc-install'
}

#+       login        Log into AWS
#
cmd_login() { cmd_aws ecr get-login-password --region us-west-1 --profile playchemy | docker login --username AWS --password-stdin 414221411811.dkr.ecr.us-west-1.amazonaws.com ; }

#+       make         User docker to build the dev containers
#
cmd_make() { 
    cd $THIS_DIR
    docker-compose build ; 
}

#+       open         Open the dev website
#
cmd_open() { open http://localhost/; }

#+       psql         Execute sql commands
#
cmd_psql() {
    cmd_sh postgres 'psql -h localhost -U postgres -d myipc'
}

#+       pull         Pull the latest code
#
cmd_pull() { cd $THIS_DIR ; git pull ; }

#+       push         Push the code to AWS
#
cmd_push() {    
    echo "=> login"
    cmd_login
    [ $? -ne 0 ] && error "login failed"

    echo "=> tag"
    docker tag myipcio_web 414221411811.dkr.ecr.us-west-1.amazonaws.com/myipc:latest
    [ $? -ne 0 ] && error "tag failed"
    echo "tag successful"
    
    echo "=> push"
    docker push 414221411811.dkr.ecr.us-west-1.amazonaws.com/myipc:latest
    [ $? -ne 0 ] && error "push failed"
    echo "push successful"
}

cmd_restart() { php $THIS_DIR/EcsTaskStopCommand.php prd myipc-prd ; }

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

#+       ssh          Open a shell on the prd server
#
cmd_ssh() { ssh -i $THIS_DIR/devops/conf/ssh/id_rsa x@y "$@" ; }

#+       source       Edit the source to this script
#
cmd_source() { vi $THIS ; }

cmd_version() { cd $THIS_DIR ; git describe --dirty ; }

#------------------------------------------------------------------------------
main() {
    cmd=$1 ; shift
    case $cmd in
        aws) cmd_aws "$@" ;;
        clean) cmd_clean "$@" ;;
        clone) cmd_clone "$@" ;;
        debug) cmd_debug "$@" ;;
        help) cmd_help "$@" ;;
        init) cmd_init "$@" ;;
        login) cmd_login "$@" ;;
        make) cmd_make "$@" ;;
        open) cmd_open "$@" ;;
        psql) cmd_psql "$@" ;;
        pull) cmd_pull "$@" ;;
        push|deploy) cmd_push "$@" ;;
        restart) cmd_restart "$@" ;;
        run) cmd_run "$@" ;;
        sh) cmd_sh "$@" ;;
        ssh) cmd_ssh "$@" ;;
        source) cmd_source "$@" ;;
        version) cmd_version "$@" ;;
        *) echo "m [command]" ;;
    esac
}

THIS_DIR=$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd )
THIS=$THIS_DIR/m.sh
main "$@"
