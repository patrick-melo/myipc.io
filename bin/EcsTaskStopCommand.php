<?php
require dirname(__FILE__).'/aws.phar';

class EcsTaskStopCommand {
    public function executeCommand($argv) {
        (count($argv) == 3) || die ("Usage: EcsTaskStopCommand [cluster] [service]\n");
        $id = $argv[2];
        $cluster = $argv[1];
        $service = $argv[2];        
        
        $client = new \Aws\Ecs\EcsClient([
            'region'  => 'us-west-1',
            'version' => 'latest',
            'profile' => 'playchemy'
        ]);
        
        $tasks = $client->listTasks(['cluster'=>$cluster])['taskArns'];
        //var_dump($client->listTasks(['cluster'=>$cluster]));
        if (!$tasks){
            echo ("No tasks for cluster $cluster\n"); exit;
        }
        foreach ($tasks as $task) {
            echo "=> stop $task\n";
            $client->stopTask(['cluster'=>$cluster, 'task'=>$task]);
        }
    }
}

global $argv;
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
$class = (__NAMESPACE__.'\\'.pathinfo(__FILE__, PATHINFO_FILENAME));
exit ((new $class)->executeCommand($argv));
