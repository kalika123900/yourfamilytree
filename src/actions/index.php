<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/functions.php');
global $client;
$response = [];
if(isset($_POST['action'])):
    $action = $_POST['action'];
    $data = $_POST;
   
    if(function_exists($action)){
        $action($data);
    }
    else
    {
        $response['status'] = false;
        $response['message'] = 'No action found!';
        echo json_encode($response); die();
    }
else:
    $response['status'] = false;
    $response['message'] = 'You are not authorize for this call!';
    echo json_encode($response); die();
endif;