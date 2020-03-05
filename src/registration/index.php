<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/functions.php');
global $client;
$error = [];
$error['status'] =false;
$error['error'] = [];
$response['status'] = false;
$response['error'] = false;
$response['errorMessage'] = [];
$response['message'] = '';
/* Logic TO CREATE MAIN USER NODE*/
$title = $_POST['title'];
$name = $_POST['name'];
$last_name = $_POST['surname'];
$dob = $_POST['title'];
if(isset($_POST['title']))
{
    $title = $_POST['title'];
}
else
{
    $error['status'] = true;
    $error['error']['title'] = 'Title is required!';
}
if(isset($_POST['name']))
{
    $name = $_POST['name'];
}
else
{
    $error['status'] = true;
    $error['error']['name'] = 'Name is required!';
}
if(isset($_POST['surname']))
{
    $last_name = $_POST['surname'];
}
else
{
    $error['status'] = true;
    $error['error']['surname'] = 'Last name is required';
}
if(isset($_POST['dob']))
{
    $dob = $_POST['dob'];
}
else
{
    $error['status'] = true;
    $error['error']['dob'] = 'Date of Birth is required';
}
if(isset($_POST['marital_status']))
{
    $marital_status = $_POST['marital_status'];
}
else
{
    $error['status'] = true;
    $error['error']['marital_status'] = 'Marital Status is required';
}
if(isset($_POST['ftitle']))
{
    $ftitle = $_POST['ftitle'];
}
else
{
    $error['status'] = true;
    $error['error']['ftitle'] = 'Father\'s title is required';
}
if(isset($_POST['fname']))
{
    $fname = $_POST['fname'];
}
else
{
    $error['status'] = true;
    $error['error']['fname'] = 'Father\'s name is required';
}
if(isset($_POST['fsurname']))
{
    $flast_name = $_POST['fsurname'];
}
else
{
    $error['status'] = true;
    $error['error']['fsurname'] = 'Father\'s last name is required';
}
if(isset($_POST['fdob']))
{
    $fdob = $_POST['fdob'];
}
else
{
    $error['status'] = true;
    $error['error']['fdob'] = 'Father\'s dob is required';
}
if(isset($_POST['mtitle']))
{
    $mtitle = $_POST['mtitle'];
}
else
{
    $error['status'] = true;
    $error['error']['mtitle'] = 'Mother\'s title is required';
}
if(isset($_POST['mname']))
{
    $mname = $_POST['mname'];
}
else
{
    $error['status'] = true;
    $error['error']['mname'] = 'Mother\s name is required';
}
if(isset($_POST['msurname']))
{
    $msurname = $_POST['msurname'];
}
else
{
    $error['status'] = true;
    $error['error']['msurname'] = 'Mother\'s last name is required';
}
if(isset($_POST['mdob']))
{
    $mdob = $_POST['mdob'];
}
else
{
    $error['status'] = true;
    $error['error']['mdob'] = 'Mother\'s dob name is required';
}
if($error['status']==true)
{
    $response['status'] = false;
    $response['error'] = true;
    $response['errorMessage'] = $error['error'];
    echo json_encode($response); die();
}
$isSpouse = false;
$spouse = [];
if(isset($_POST['ssname'])):
    foreach($_POST['ssname'] as $key=>$spouseValue):
        $spouse[$key]=[];
        if(isset($_POST['ssname']))
        {
            $spouse[$key]['ssname'] = $_POST['ssname'][$key];
        }
        if(isset($_POST['sssurname']))
        {
            $spouse[$key]['sssurname'] = $_POST['sssurname'][$key];
        }
        if(isset($_POST['ssdob']))
        {
            $spouse[$key]['ssdob'] = $_POST['ssdob'][$key];
        }
    endforeach;
endif;
$existance = check_if_person_exists_basic($name,$last_name,$dob,$fname,$flast_name,$fdob,$mname,$msurname,$mdob);

$master_uuid = '';
if($existance['exists']==false)
{
  //Insert Node
  $data = $_POST;
  $data['operation'] = 'add';
  $master_uuid = handlePerson($data);
}
else{
    if($existance['exists']==true && $existance['uuid']==false)
    {
       if($marital_status=='unmarried')
       {
            $data = $_POST;
            $data['operation'] = 'add';
            $master_uuid = handlePerson($data);
       }
       else 
       {
            $existanceAdvance = check_if_person_exists_advance($name,$last_name,$dob,$spouse[0]['ssname'],$spouse[0]['sssurname'],$spouse[0]['ssdob'],$fname,$flast_name,$mname,$msurname);
            if( $existanceAdvance['exists']==true)
            {   //update
                $uuid = $existanceAdvance['uuid'];
                $data = $_POST;
                $data['operation'] = 'update';
                $data['uuid'] = $uuid;
                $master_uuid = handlePerson($data);
                
            }
            else
            {
                //insert
                $data = $_POST;
                $data['operation'] = 'add';
                $master_uuid = handlePerson($data);
            }
       }
    
    }
    else
    {
            $uuid = $existance['uuid'];
            $data = $_POST;
            $data['operation'] = 'update';
            $data['uuid'] = $uuid;
            $master_uuid = handlePerson($data);
    }
}
//Handle Father
$fuuid = handleFather($data,$master_uuid);
//Handle Mother
$muuid = handleMother($data,$master_uuid);
//Handle Spouse
handleMomDadRelation($fuuid,$muuid);
//Need to Handle Inter Brother Sister Relationship
if($marital_status=='married')
{   /*Need to handle Child Brother Sister Relationship*/
    $ssuuid = handleSpouse($data,$master_uuid);
    handleChild($data,$master_uuid,$ssuuid);
    
}
$brothers = [];
$brothers = handleBrother($data,$master_uuid,$fuuid,$muuid);
handleBrothersRelation($brothers);

$sisters = [];
$sisters = handleSister($data,$master_uuid,$fuuid,$muuid);
handleSistersRelation($sisters);
if(count($brothers)>0 && count($sisters)>0)
{
    handleBrotherSisterRelation($brothers,$sisters);
}
$password = random_strings(8);
$setPassword = [];
$setPassword['uuid'] = $master_uuid;
$setPassword['email'] = $_POST['email'];
$setPassword['password'] = $password;
changePassword($setPassword);
$response['status'] = 'success';
$response['message'] = 'Data Inserted Successfully!';
$response['data'] = array('uuid'=>$master_uuid);
echo json_encode($response);
?>