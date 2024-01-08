dockerid() { echo $(docker ps --format "table {{.ID}}\t{{.Names}}" | awk '$2 ~ /myipcio-'$1'-1/ {print $1}') ; }

#+       conf         Display a conf setting (used by psql)
#
cmd_conf() { awk -F\" '/'$2'/ {print $2}' $1 ;}

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

cmd_init() { cmd init "$@"; }

#+       init react   Init react from within the docker container
#
cmd_init_react() {
    echo "=> init react"
    cmd_sh web 'bin/m.sh init reactlocal'
}

#+       init react   Init react from the host os
#
cmd_init_reactlocal() {
    npm install
    cd react &&\
        cp src/_config.js src/config.js &&\
        npm install jsx-runtime &&\
        npm run build &&\
        mv build/index.html build/main.html &&\
        mkdir build/sprites &&\
        mkdir build/cards &&\
        cd build &&\
        tar xf ../../sprites.tgz
}

#+       init react   Create a tar.gz file with sprites to commit to the repo.
#
cmd_init_sprites() {
    echo "=> create postgres table"
    cmd_sh postgres 'psql -h localhost -U postgres -d postgres -c "create database myipc"' >/dev/null 2>&1
    echo "=> node ipc-install"
    cmd_sh web 'node ipc-install'
    echo "=> create postgres table"
    cmd_sh web 'cd react/build ; tar cvfz ../../sprites.tgz sprites'
}

#+       psql         Execute sql commands
#
cmd_psql() {
    file=$THIS_DIR/react/src/config.js
    
    host=$(cmd_conf $file IPCDB_HOST)
    user=$(cmd_conf $file IPCDB_USERNAME)
    pass=$(cmd_conf $file IPCDB_PASSWORD)
    data=$(cmd_conf $file IPCDB_DATABASE)

    cmd_sh postgres "PGPASSWORD=$pass psql -h $host -d $data -U $user"
}