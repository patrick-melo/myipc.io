usage() { echo "Usage: $@" ; exit 1; }

error() { RED='\033[0;31m' ; NC='\033[0m' ; printf "${RED}$@${NC}\n" ; exit 1 ; }

folder() { printf '%q\n' "${PWD##*/}"; }

pause() { echo -n "Press any key to continue . . ." ; read -sn1 response ; echo ; }

cmd() {
    cmd=$1 ; shift
    
    usage=cmd_${cmd}_@usage

    # subcmd not specified: call usage
    if [[ -z $1 && $(type -t $usage) == function ]] ; then
        $usage
    else
        subcmd=cmd_${cmd}_$1
        default=cmd_${cmd}_@default

        # subcmd specified and exists: call subcmd
        if [[ $(type -t $subcmd) == function ]] ; then
            shift
            $subcmd "$@"
        
        # subcmd specified and NOT exists but default exists: call default
        elif [[ $(type -t $default) == function ]] ; then
            $default "$@"

        # subcmd specified and NOT exists and default NOT exists: error
        else
            echo "Invalid command."
        fi
    fi
    
}

main() {
    #cmd=$(echo $1 | sed 's/!/_bang/g') ; shift
    script=$(basename $0 .sh)
    cmd=$1 ; shift
    if [[ $(type -t cmd_$cmd) == function ]] ; then
        cmd_$cmd "$@"
    else
        usage "$script [ 'help' | command ]"
    fi
}
