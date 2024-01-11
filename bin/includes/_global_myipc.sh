dockerid() { echo $(docker ps --format "table {{.ID}}\t{{.Names}}" | awk '$2 ~ /myipcio-'$1'-1/ {print $1}') ; }

#+       conf         Display a conf setting (used by psql)
#
cmd_conf() { awk -F\" '/'$2'/ {print $2}' $1 ;}

#+       sh           Open a shell on the docker container
#
cmd_bash() {  
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

cmd_init() { cmd init "$@"; }

#+       init react   Init react from within the docker container
#
cmd_init_react() {
    echo "=> init react"
    cmd_bash web 'bin/m.sh init reactlocal'
}

#+       init react   Init react from the host os
#
cmd_init_reactlocal() {
    npm install
    cd react &&\
        cp src/_config.js src/config.js &&\
        cmd_setversion &&
        npm run build &&\
        mv build/index.html build/main.html &&\
        mkdir build/sprites &&\
        mkdir build/cards &&\
        cd build &&\
        tar xf ../../sprites.tgz
}

cmd_setversion() {
    pushd /usr/app
    local version=$(git describe --dirty)
    sed -i'' -e 's/VERSION: .*,/VERSION: "'$version'",/g' react/src/config.js
    popd
}

#+       init react   Create a tar.gz file with sprites to commit to the repo.
#
cmd_init_sprites() {
    echo "=> create postgres table"
    cmd_bash postgres 'psql -h localhost -U postgres -d postgres -c "create database myipc"' >/dev/null 2>&1
    echo "=> node ipc-install"
    cmd_bash web 'node ipc-install'
    echo "=> create sprites zip"
    cmd_bash web 'cd react/build ; tar cfz ../../sprites.tgz sprites'
}

#+       psql         Execute sql commands
#
cmd_psql() { cmd_bash postgres "psql \$DATABASE_URL"; }