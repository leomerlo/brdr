<?php

session_start();

require '../../autoload.php';

use BRDR\Core\View;

$path = realpath(__DIR__ . "/../../");
$path = str_replace('\\', '/', $path);

require $path . "/app/routes.php";

$app = new \BRDR\Core\App($path);

try {
	$app->run();
} catch(Exception $e){
	View::sendError($e->getMessage());
}