<?php
session_start();
const root = '/';
const siteHeader = 'YOURFAMILYTREE.in';

require_once($_SERVER['DOCUMENT_ROOT']."/includes/vendor/autoload.php");
$types = [10=>'super-admin',3=>'admin',2=>'moderator',1=>'contributor',0=>'follower'];
$image_path = '/www/clients/kworld.com/src/uploads/images/';
$image_url = 'https://www.yourfamilytree.in/uploads/images/';
use GraphAware\Neo4j\Client\ClientBuilder;
use Mailgun\Mailgun;
$client = ClientBuilder::create()
->addConnection('default', 'http://neo4j:1@3.14.90.200:7474')
->addConnection('bolt', 'bolt://neo4j:1@3.14.90.200:7687')
->build();  
function guidv4($data) {
    assert(strlen($data) == 16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
function is_valid($uuid) {
    return preg_match('/^\{?[0-9a-f]{8}\-?[0-9a-f]{4}\-?[0-9a-f]{4}\-?'.
    '[0-9a-f]{4}\-?[0-9a-f]{12}\}?$/i', $uuid) === 1;
}
function get_client_ip() {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if(isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
function store_password($password) {
    $options = [
        'memory_cost' => 1<<17, // 128 Mb
        'time_cost'   => 2,
        'threads'     => 8,
    ];
    $hashed_password = password_hash($password, PASSWORD_ARGON2I, $options);
    return $hashed_password;
}
function check_if_person_exists_basic($name,$last_name,$dob,$fname,$flast_name,$fdob,$mname,$mlast_name,$mdob)
{
    global $client;
    $person_check = '';
    $status = [];
    $status['exists'] = false;
    $status['uuid'] = false;
    $uuid = false;
    $result = $client->run("MATCH (n:User) WHERE TOLOWER(n.name)='".strtolower($name)."' AND TOLOWER(n.last_name)='".strtolower($last_name)."' AND TOLOWER(n.dob)='".strtolower($dob)."' return n");
    $records = $result->getRecords();
    
    $matchCount=1;
    if(count($records)>0)
    {   if(count($records)>1)
        {   $everMatch = false;
            foreach($records as $key=>$personObj):
            
            $person = $personObj->values()[0];
           
            if($person->hasValue('father_name') && $person->get('father_name')!='' && strtolower($person->get('father_name'))==strtolower($fname) && $person->hasValue('father_last_name') && $person->get('father_last_name')!='' && strtolower($person->get('father_last_name'))==strtolower($flast_name) && $person->hasValue('father_dob') && $person->get('father_dob')!='' && $person->get('father_dob')==$fdob)
            $matchCount++;

            if($person->hasValue('mother_name') && $person->get('mother_name')!='' && strtolower($person->get('mother_name'))==strtolower($mname) && $person->hasValue('mother_last_name') && $person->get('mother_last_name')!='' && strtolower($person->get('mother_last_name'))==strtolower($mlast_name) && $person->hasValue('mother_dob') && $person->get('mother_dob')!='' && $person->get('mother_dob')==$mdob)
            $matchCount++;
            if($matchCount==3)
            {
               $status['exists'] = true;
               $status['uuid'] = $person->get('uuid');
               $everMatch = true;
               break;
            }
            endforeach;
            if($everMatch==false)
            {
                $status['exists'] = true;
                $status['uuid'] = false;
            }
        }
        else
        {
            $personObj = $records[0];
            $matchCount = 1;
            $person = $personObj->values()[0];
            if($person->hasValue('father_name') && $person->get('father_name')!='' && strtolower($person->get('father_name'))==strtolower($fname) && $person->hasValue('father_last_name') && $person->get('father_last_name')!='' && strtolower($person->get('father_last_name'))==strtolower($flast_name) && $person->hasValue('father_dob') && $person->get('father_dob')!='' && $person->get('father_dob')==$fdob)
            $matchCount++;

            if($person->hasValue('mother_name') && $person->get('mother_name')!='' && strtolower($person->get('mother_name'))==strtolower($mname) && $person->hasValue('mother_last_name') && $person->get('mother_last_name')!='' && strtolower($person->get('mother_last_name'))==strtolower($mlast_name) && $person->hasValue('mother_dob') && $person->get('mother_dob')!='' && $person->get('mother_dob')==$mdob)
            $matchCount++;
          
            if($matchCount==3)
            {
               $status['exists'] = true;
               $status['uuid'] = $person->get('uuid');
            }
            else
            {
               $status['exists'] = true;
               $status['uuid'] = false;
            }

        }
    }
    else
    {
        $status['exists'] = false;
        $status['uuid'] = false;
    }
    return $status;
}
function check_if_person_exists_intermediate($name,$last_name,$dob,$sname,$slast_name,$sdob)
{
    global $client;
   
    $person_check = '';
    $status = [];
    $status['exists'] = false;
    $status['uuid'] = false;
    $uuid = false;
    $result = $client->run("MATCH (n:User) WHERE TOLOWER(n.name)='".strtolower($name)."'AND TOLOWER(n.last_name)='".strtolower($last_name)."' AND n.dob='$dob' return n");
    $records = $result->getRecords();
    $matchCount=1;
    
    if(count($records)>0)
    { 
         if(count($records)>1)
        {   $everMatch = false;
            foreach($records as $key=>$personObj):
            $person = $personObj->values()[0];
            if($person->hasValue('marital_status') && $person->get('marital_status')=='unmarried'):
                continue;
            endif;
            if($person->hasValue('spouse_name') && $person->get('spouse_name')!='' && strtolower($person->get('spouse_name'))==strtolower($sname) && $person->hasValue('spouse_last_name') && $person->get('spouse_last_name')!='' && strtolower($person->get('spouse_last_name'))==strtolower($slast_name) && $person->hasValue('spouse_dob') && $person->get('spouse_dob')!='' && $person->get('spouse_dob')==$sdob)
            $matchCount++;
            if($matchCount==2)
            {
               $status['exists'] = true;
               $status['uuid'] = $person->get('uuid');
               $everMatch = true;
               die('2'); 
               break;
            }
            endforeach;
            if($everMatch==false)
            {
                $status['exists'] = false;
                $status['uuid'] = false;
            }
        }
        else
        {
            $personObj = $records[0];
            $matchCount = 0;
            $person = $personObj->values()[0];
         
            if($person->hasValue('spouse_name') && $person->get('spouse_name')!='' && strtolower($person->get('spouse_name'))==strtolower($sname) && $person->hasValue('spouse_last_name') && $person->get('spouse_last_name')!='' && strtolower($person->get('spouse_last_name'))==strtolower($slast_name) && $person->hasValue('spouse_dob') && $person->get('spouse_dob')!='' && $person->get('spouse_dob')==$sdob)
            $matchCount++;
            
            if($matchCount==1)
            {
               $status['exists'] = true;
               $status['uuid'] = $person->get('uuid');
            }
            else
            {
               $status['exists'] = false;
               $status['uuid'] = false;
            }

        }
    }
    else
    {
        $status['exists'] = false;
        $status['uuid'] = false;
    }
    return $status;
}
function check_if_person_exists_advance($name,$last_name,$dob,$sname,$slast_name,$sdob,$sfname,$sflast_name,$smname,$smlast_name)
{
    global $client;
   
    $person_check = '';
    $status = [];
    $status['exists'] = false;
    $status['uuid'] = false;
    $uuid = false;
    $result = $client->run("MATCH (n:User) WHERE TOLOWER(n.name)='".strtolower($name)."'AND TOLOWER(n.last_name)='".strtolower($last_name)."' AND n.dob='$dob' return n");
    $records = $result->getRecords();
    $matchCount=1;
    
    if(count($records)>0)
    { 
         if(count($records)>1)
        {   $everMatch = false;
            foreach($records as $key=>$personObj):
            $person = $personObj->values()[0];
           
            if($person->hasValue('father_name') && $person->get('father_name')!='' && strtolower($person->get('father_name'))==strtolower($sfname) && $person->hasValue('father_last_name') && $person->get('father_last_name')!='' && strtolower($person->get('father_last_name'))==strtolower($sflast_name)  && $person->hasValue('mother_name') && $person->get('mother_name')!='' && strtolower($person->get('mother_name'))==strtolower($smname) && $person->hasValue('mother_last_name') && $person->get('mother_last_name')!='' && strtolower($person->get('mother_last_name'))==strtolower($smlast_name))
            $matchCount++;
            $personA = $person->values();
            if($matchCount==2)
            {
               $status['exists'] = true;
               $status['uuid'] = $person->get('uuid');
               $everMatch = true;
               die('2'); 
               break;
            }
            endforeach;
            if($everMatch==false)
            {
                $status['exists'] = false;
                $status['uuid'] = false;
            }
        }
        else
        {
            $personObj = $records[0];
            $matchCount = 0;
            $person = $personObj->values()[0];
         
            if($person->hasValue('father_name') && $person->get('father_name')!='' && strtolower($person->get('father_name'))==strtolower($sfname) && $person->hasValue('father_last_name') && $person->get('father_last_name')!='' && strtolower($person->get('father_last_name'))==strtolower($sflast_name)  && $person->hasValue('mother_name') && $person->get('mother_name')!='' && strtolower($person->get('mother_name'))==strtolower($smname) && $person->hasValue('mother_last_name') && $person->get('mother_last_name')!='' && strtolower($person->get('mother_last_name'))==strtolower($smlast_name))
            $matchCount++;
            
            if($matchCount==1)
            {
               $status['exists'] = true;
               $status['uuid'] = $person->get('uuid');
            }
            else
            {
               $status['exists'] = false;
               $status['uuid'] = false;
            }

        }
    }
    else
    {
        $status['exists'] = false;
        $status['uuid'] = false;
    }
    return $status;
}
function handlePerson($data){
    global $client;
   
    if($data['operation']=='add'):
        $uuid =  guidv4(random_bytes(16));
        $person = [];
        $person['title'] = $data['title'];
        $person['name'] = $data['name'];
        $person['last_name'] = $data['surname'];
        if(isset($data['last_name']) && $data['last_name'])
        {
            $person['last_name'] = $data['last_name'];
        }
        $person['dob'] = $data['dob'];
        $person['father_title'] = $data['ftitle'];
        $person['father_name'] = $data['fname'];
        $person['father_last_name'] = $data['fsurname'];
        $person['father_dob'] = $data['fdob'];
        $person['mother_title'] = $data['mtitle'];
        $person['mother_name'] = $data['mname'];
        $person['mother_last_name'] = $data['msurname'];
        $person['mother_dob'] = $data['mdob'];
        $person['marital_status'] = $data['marital_status'];
        if(isset($data['date_of_marriage']) && $data['date_of_marriage']!='')
        {
            $person['date_of_marriage'] = $data['date_of_marriage'];
        }
        if(isset($data['aadhar_no']) && $data['aadhar_no']!='')
        {
            $person['aadhar_no'] = $data['aadhar_no'];
        }
        if(isset($data['mobile_no']) && $data['mobile_no']!='')
        {
            $person['mobile_no'] = $data['mobile_no'];
        }
        if(isset($data['your_occupation']) && $data['your_occupation']!='')
        {
            $person['occupation'] = $data['your_occupation'];
            if(strtolower($person['your_occupation'])=='other' && isset($data['your_occupation_other']) && $data['your_occupation_other']!='')
            {
                $person['occupation_other'] = $data['your_occupation_other'];
            }
            
        }
        if(isset($data['name_of_business']) && $data['name_of_business']!='')
        {
            $person['name_of_business'] = $data['name_of_business'];
        }
        if(isset($data['since']) && $data['since']!='')
        {
            $person['since'] = $data['since'];
        }
        if(isset($data['category']) && $data['category']!='')
        {
            $person['category'] = $data['category'];
            if(strtolower($person['category'])=='other' && isset($data['category_other']) && $data['category_other']!='')
            {
                $person['category_other'] = $data['category_other'];
            }
        }
        if(isset($data['sector_major']) && $data['sector_major']!='')
        {
            $person['sector_major'] = $data['sector_major'];
            if(strtolower($person['secotr_major'])=='other' && isset($data['sector_major_other']) && $data['sector_major_other']!='')
            {
                $person['sector_major_other'] = $data['sector_major_other'];
            }
        }
        if(isset($data['specific_business']) && $data['specific_business']!='')
        {
            $person['specific_business'] = $data['specific_business'];
        }
        if(isset($data['brand_name']) && $data['brand_name']!='')
        {
            $person['brand_name'] = $data['brand_name'];
        }
        if(isset($data['landline_no']) && $data['landline_no']!='')
        {
            $person['landline_no'] = $data['landline_no'];
        }
        if(isset($data['email']) && $data['email']!='')
        {
            $person['email'] = $data['email'];
        }
        if(isset($data['website']) && $data['website']!='')
        {
            $person['website'] = $data['website'];
        }
        if(isset($data['address']) && $data['address']!='')
        {
            $person['address'] = $data['address'];
        }
        if(isset($data['state']) && $data['state']!='')
        {
            $person['state'] = $data['state'];
        }
        if(isset($data['city']) && $data['city']!='')
        {
            $person['city'] = $data['city'];
        }
        if(isset($data['qualification']) && $data['qualification']!='')
        {
            $person['qualification'] = $data['qualification'];
        }
        if(isset($data['fgotra']) && $data['fgotra']!='')
        {
            $person['gotra'] = $data['fgotra'];
        }
        if(isset($data['gender']) && $data['gender']!='')
        {
            $person['gender'] = $data['gender'];
        }
        if(isset($data['fgotra_other']) && $data['fgotra_other']!='')
        {
            $person['gotra'] = $data['fgotra_other'];
        }
        
        if(isset($data['otherc']) && $data['otherc']!='')
        {
            $person['other-community'] = $data['otherc'];
        }
        if($person['marital_status']=='married')
        {
            foreach($data['ssname'] as $key=>$value):
                if($key==0):
                    $person['spouse_name'] = $data['ssname'][$key];
                    $person['spouse_last_name'] = $data['sssurname'][$key];
                    $person['spouse_dob'] = $data['ssdob'][$key];
                else:
                    $person['spouse_name_'+$key] = $data['ssname'][$key];
                    $person['spouse_last_name_'+$key] = $data['sssurname'][$key];
                    $person['spouse_dob_'+$key] = $data['ssdob'][$key];
                endif;
            endforeach;
        }
        $person['uuid'] = $uuid;
        $person = array_map('trim', $person);
        $client->run("CREATE (u:User) SET u += {infos}", ['infos' =>$person ]);
        $cuid = $_POST['community'];
        $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
    else:
        $uuid = $data['uuid'];
        $person = [];
        $person['title'] = $data['title'];
        $person['name'] = $data['name'];
        $person['last_name'] = $data['surname'];
        $person['dob'] = $data['dob'];
        $person['father_name'] = $data['fname'];
        $person['father_last_name'] = $data['fsurname'];
        $person['father_dob'] = $data['fdob'];
        $person['mother_name'] = $data['mname'];
        $person['gender'] = $data['gender'];
        $person['mother_last_name'] = $data['msurname'];
        $person['mother_dob'] = $data['mdob'];
        $person['marital_status'] = $data['marital_status'];
        if(isset($data['date_of_marriage']) && $data['date_of_marriage']!='')
        {
            $person['date_of_marriage'] = $data['date_of_marriage'];
        }
        if(isset($data['aadhar_no']) && $data['aadhar_no']!='')
        {
            $person['aadhar_no'] = $data['aadhar_no'];
        }
        if(isset($data['mobile_no']) && $data['mobile_no']!='')
        {
            $person['mobile_no'] = $data['mobile_no'];
        }
        if(isset($data['your_occupation']) && $data['your_occupation']!='')
        {
            $person['occupation'] = $data['your_occupation'];
            if(strtolower($person['your_occupation'])=='other' && isset($data['your_occupation_other']) && $data['your_occupation_other']!='')
            {
                $person['occupation_other'] = $data['your_occupation_other'];
            }
            
        }
        if(isset($data['name_of_business']) && $data['name_of_business']!='')
        {
            $person['name_of_business'] = $data['name_of_business'];
        }
        if(isset($data['since']) && $data['since']!='')
        {
            $person['since'] = $data['since'];
        }
        if(isset($data['category']) && $data['category']!='')
        {
            $person['category'] = $data['category'];
            if(strtolower($person['category'])=='other' && isset($data['category_other']) && $data['category_other']!='')
            {
                $person['category_other'] = $data['category_other'];
            }
        }
        if(isset($data['sector_major']) && $data['sector_major']!='')
        {
            $person['sector_major'] = $data['sector_major'];
            if(strtolower($person['secotr_major'])=='other' && isset($data['sector_major_other']) && $data['sector_major_other']!='')
            {
                $person['sector_major_other'] = $data['sector_major_other'];
            }
        }
        if(isset($data['specific_business']) && $data['specific_business']!='')
        {
            $person['specific_business'] = $data['specific_business'];
        }
        if(isset($data['brand_name']) && $data['brand_name']!='')
        {
            $person['brand_name'] = $data['brand_name'];
        }
        if(isset($data['landline_no']) && $data['landline_no']!='')
        {
            $person['landline_no'] = $data['landline_no'];
        }
        if(isset($data['email']) && $data['email']!='')
        {
            $person['email'] = $data['email'];
        }
        if(isset($data['website']) && $data['website']!='')
        {
            $person['website'] = $data['website'];
        }
        if(isset($data['address']) && $data['address']!='')
        {
            $person['address'] = $data['address'];
        }
        if(isset($data['state']) && $data['state']!='')
        {
            $person['state'] = $data['state'];
        }
        if(isset($data['city']) && $data['city']!='')
        {
            $person['city'] = $data['city'];
        }
        if(isset($data['qualification']) && $data['qualification']!='')
        {
            $person['qualification'] = $data['qualification'];
        }
        if(isset($data['fgotra']) && $data['fgotra']!='')
        {
            $person['gotra'] = $data['fgotra'];
        }
        if(isset($data['fgotra_other']) && $data['fgotra_other']!='')
        {
            $person['gotra'] = $data['fgotra_other'];
        }
        
        if(isset($data['otherc']) && $data['otherc']!='')
        {
            $person['other-community'] = $data['otherc'];
        }
        if($person['marital_status']=='married')
        {   foreach($data['ssname'] as $key=>$value):
                if($key==0):
                    $person['spouse_name'] = $data['ssname'][$key];
                    $person['spouse_last_name'] = $data['sssurname'][$key];
                    $person['spouse_dob'] = $data['ssdob'][$key];
                else:
                    $person['spouse_name_'+$key] = $data['ssname'][$key];
                    $person['spouse_last_name_'+$key] = $data['sssurname'][$key];
                    $person['spouse_dob_'+$key] = $data['ssdob'][$key];
                endif;
            endforeach;
        }
    
        $client->run("MATCH (u:User {uuid:'$uuid'}) SET u += {infos}", ['infos' =>$person]);
        $cuid = $_POST['community'];
        if($cuid=='other')
        {
            
        }
        $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
    endif;

    return $uuid;
}
function handleFather($data,$ofUuid){
  global $client;
  $person['title'] = $data['ftitle'];
  $name = $person['name'] = $data['fname'];
  $last_name = $person['last_name'] = $data['fsurname'];
  $dob = $person['dob'] = $data['fdob'];
  $sname = $person['spouse_title'] = $data['stitle'];
  $sname = $person['spouse_name'] = $data['mname'];
  $ssurname = $person['spouse_last_name'] = $data['msurname'];
  $sdob = $person['spouse_dob'] = $data['mdob'];
  $marrital_status = $person['marital_status'] ='married';
  if(isset($data['faadhar_no']) && $data['faadhar_no']!='')
    {
        $person['aadhar_no'] = $data['faadhar_no'];
    }
    if(isset($data['fmobile_no']) && $data['fmobile_no']!='')
    {
        $person['mobile_no'] = $data['fmobile_no'];
    }
    if(isset($data['femail']) && $data['femail']!='')
    {
        $person['email'] = $data['femail'];
    }
    if(isset($data['fyour_occupation']) && $data['fyour_occupation']!='')
    {
        $person['occupation'] = $data['fyour_occupation'];
        if(strtolower($person['fyour_occupation'])=='other' && isset($data['fyour_occupation_other']) && $data['fyour_occupation_other']!='')
        {
            $person['occupation_other'] = $data['fyour_occupation_other'];
        }
        
    }
    if(isset($data['fbusiness_name']) && $data['fbusiness_name']!='')
    {
        $person['business_name'] = $data['fbusiness_name'];
    }
    if(isset($data['fgotra']) && $data['fgotra']!='')
    {
        $person['gotra'] = $data['fgotra'];
    }
    if(isset($data['fgotra_other']) && $data['fgotra_other']!='')
    {
        $person['gotra'] = $data['fgotra_other'];
    }
    if(isset($data['otherc']) && $data['otherc']!='')
    {
        $person['other-community'] = $data['otherc'];
    }
  $existanceAdvance = check_if_person_exists_intermediate($name,$last_name,$dob,$sname,$ssurname,$sdob);
  if( $existanceAdvance['exists']==true)
  {   //update
      $uuid = $existanceAdvance['uuid'];
      if($data['gender']=='male'){
        $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Son]->(u1)");
      }
      else
      {
        $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Daughter]->(u1)");  
      }
      $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Father]->(u1)");
      $cuid = $_POST['community'];
      $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
      return $uuid;
  }
  else
  {    $uuid = guidv4(random_bytes(16));
    $person['uuid'] = $uuid;
    $person = array_map('trim', $person);
    $person['gender'] = 'male';
    $client->run("CREATE (u:User) SET u += {infos}", ['infos' =>$person ]);
     if($data['gender']=='male'){
        $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Son]->(u1)");
      }
      else
      {
        $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Daughter]->(u1)");  
      }
      $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Father]->(u1)");
      $cuid = $_POST['community'];
      $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
       return $uuid;
  }
}

function handleMother($data,$ofUuid){
    global $client;
    $person['title'] = $data['mtitle'];
    $name = $person['name'] = $data['mname'];
    $last_name = $person['last_name'] = $data['msurname'];
    $dob = $person['dob'] = $data['mdob'];
    $person['spouse_title'] = $data['ftitle'];
    $sname = $person['spouse_name'] = $data['fname'];
    $ssurname = $person['spouse_last_name'] = $data['fsurname'];
    $sdob = $person['spouse_dob'] = $data['fdob'];
    $marrital_status = $person['marital_status'] = 'married';
    if(isset($data['maadhar_no']) && $data['maadhar_no']!='')
    {
        $person['aadhar_no'] = $data['maadhar_no'];
    }
    if(isset($data['mmobile_no']) && $data['mmobile_no']!='')
    {
        $person['mobile_no'] = $data['mmobile_no'];
    }
    if(isset($data['memail']) && $data['memail']!='')
    {
        $person['email'] = $data['memail'];
    }
    if(isset($data['myour_occupation']) && $data['myour_occupation']!='')
    {
        $person['occupation'] = $data['myour_occupation'];
        if(strtolower($person['myour_occupation'])=='other' && isset($data['myour_occupation_other']) && $data['myour_occupation_other']!='')
        {
            $person['occupation_other'] = $data['myour_occupation_other'];
        }
        
    }
    if(isset($data['mbusiness_name']) && $data['mbusiness_name']!='')
    {
        $person['business_name'] = $data['mbusiness_name'];
    }
    if(isset($data['mgotra']) && $data['mgotra']!='')
    {
        $person['gotra'] = $data['mgotra'];
    }
    if(isset($data['mgotra_other']) && $data['mgotra_other']!='')
    {
        $person['gotra'] = $data['mgotra_other'];
    }
    if(isset($data['otherc']) && $data['otherc']!='')
    {
        $person['other-community'] = $data['otherc'];
    }
    $existanceAdvance = check_if_person_exists_intermediate($name,$last_name,$dob,$sname,$ssurname,$sdob);
    if( $existanceAdvance['exists']==true)
    {   //update
        $uuid = $existanceAdvance['uuid'];
        if($data['gender']=='male'){
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Son]->(u1)");
          }
          else
          {
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Daughter]->(u1)");  
          }
        $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Mother]->(u1)");
        $cuid = $_POST['community'];
        $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
        return $uuid;
    }
    else
    {       $uuid = guidv4(random_bytes(16));
            $person['uuid'] = $uuid;
            $person = array_map('trim', $person);
            $person['gender'] = 'female';
            $client->run("CREATE (u:User) SET u += {infos}", ['infos' =>$person ]);
            if($data['gender']=='male'){
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Son]->(u1)");
          }
          else
          {
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Daughter]->(u1)");  
          }
         $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Mother]->(u1)");
         $cuid = $_POST['community'];
         $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
         return $uuid;
    }
}
function handleSpouse($data,$ofUuid){
    global $client;
    $uuid = '';
    foreach($data['ssname'] as $key=>$value):
        if($value=='')
        continue;
        $person['title']  = $data['sstitle'][$key];
        $name = $person['name'] = $data['ssname'][$key];
        $last_name = $person['last_name'] = $data['sssurname'][$key];
        $dob = $person['dob'] = $data['ssdob'][$key];
        $person['spouse_title'] = $data['title'];
        $sname = $person['spouse_name'] = $data['name'];
        $ssurname = $person['spouse_last_name'] = $data['surname'];
        $sdob = $person['spouse_dob'] = $data['dob'];
        $person['marital_status'] = $marrital_status = 'married';
        $sfname = $person['father_name'] = $data['ssfname'][$key];
        $sflast_name = $person['father_last_name'] = $data['ssfsurname'][$key];
        $smname = $person['mother_name'] = $data['ssmname'][$key];
        $smlast_name = $person['mother_last_name']= $data['ssmsurname'][$key];
        if($data['gender']=='male')
        {
            $person['gender'] = 'female';
        }
        if($data['gender']=='female')
        {
            $person['gender'] = 'male';
        }
        if(isset($data['ssaadhar_no'][$key]) && $data['ssaadhar_no'][$key]!='')
        {
            $person['aadhar_no'] = $data['ssaadhar_no'][$key];
        }
        if(isset($data['ssmobile_no'][$key]) && $data['ssmobile_no'][$key]!='')
        {
            $person['mobile_no'] = $data['ssmobile_no'][$key];
        }
        if(isset($data['ssemail'][$key]) && $data['ssemail'][$key]!='')
        {
            $person['email'] = $data['ssemail'][$key];
        }
        if(isset($data['ssyour_occupation'][$key]) && $data['ssyour_occupation'][$key]!='')
        {
            $person['occupation'] = $data['ssyour_occupation'][$key];
            if(strtolower($person['ssyour_occupation'][$key])=='other' && isset($data['ssyour_occupation_other'][$key]) && $data['ssyour_occupation_other'][$key]!='')
            {
                $person['occupation_other'] = $data['ssyour_occupation_other'][$key];
            }
            
        }
        if(isset($data['ssbusiness_name'][$key]) && $data['ssbusiness_name'][$key]!='')
        {
            $person['business_name'] = $data['ssbusiness_name'][$key];
        }
        if(isset($data['ssgotra'][$key]) && $data['ssgotra'][$key]!='')
        {
            $person['gotra'] = $data['ssgotra'][$key];
        }
        if(isset($data['ssgotra_other'][$key]) && $data['ssgotra_other'][$key]!='')
        {
            $person['gotra'] = $data['ssgotra_other'][$key];
        }
        if(isset($data['otherc']) && $data['otherc']!='')
        {
            $person['other-community'] = $data['otherc'];
        }
        $existanceAdvance = check_if_person_exists_advance($name,$last_name,$dob,$sname,$ssurname,$sdob,$sfname,$sflast_name,$smname,$smlast_name);
        if( $existanceAdvance['exists']==true)
        {   //update
            $uuid = $existanceAdvance['uuid'];
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:SPOUSE]->(u1)");
            $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:SPOUSE]->(u1)");
         
            
        }
        else
        {   $uuid = guidv4(random_bytes(16));
            $person['uuid'] = $uuid;
            $person = array_map('trim', $person);
            $client->run("CREATE (u:User) SET u += {infos}", ['infos' =>$person ]);
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:SPOUSE]->(u1)");
            $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:SPOUSE]->(u1)");
           
            
        }
    endforeach;
    return $uuid;
}
function handleChild($data,$ofUuid,$ofSUuid){
    global $client;
    $childSister  = [];
    $childBrother = [];
    foreach($data['cname'] as $key=>$value):
        if($value=='')
        continue;
        $person['title']            = $data['ctitle'][$key];
        $person['name']             = $data['cname'][$key];
        $person['last_name']        = $data['csurname'][$key];
        $person['dob']              = $data['cdob'][$key];
        $person['gender']           = $data['cgender'][$key];
        if($data['gender']=='male'):
            $person['father_title']     = $_POST['title'];
            $person['father_name']      = $_POST['name'];
            $person['father_last_name'] = $data['surname'];
            $person['father_dob']       = $data['dob'];
            $person['mother_title']     = $_POST['sstitle'][0];
            $person['mother_name']      = $_POST['ssname'][0];
            $person['mother_last_name'] = $data['sssurname'][0];
            $person['mother_dob']       = $data['ssdob'][0];
            if(isset($data['caadhar_no'][$key]) && $data['caadhar_no'][$key]!='')
            {
                $person['aadhar_no'] = $data['caadhar_no'][$key];
            }
            if(isset($data['cmobile_no'][$key]) && $data['cmobile_no'][$key]!='')
            {
                $person['mobile_no'] = $data['cmobile_no'][$key];
            }
            if(isset($data['cemail'][$key]) && $data['cemail'][$key]!='')
            {
                $person['email'] = $data['cemail'][$key];
            }
            if(isset($data['cyour_occupation'][$key]) && $data['cyour_occupation'][$key]!='')
            {
                $person['your_occupation'] = $data['cyour_occupation'][$key];
            }
            if(isset($data['cyour_occupation'][$key]) && $data['cyour_occupation'][$key]!='')
            {
                $person['occupation'] = $data['cyour_occupation'][$key];
                if(strtolower($person['cyour_occupation'][$key])=='other' && isset($data['cyour_occupation_other'][$key]) && $data['cyour_occupation_other'][$key]!='')
                {
                    $person['occupation_other'] = $data['cyour_occupation_other'][$key];
                }
                
            }
            if(isset($data['cbusiness_name'][$key]) && $data['cbusiness_name'][$key]!='')
            {
                $person['business_name'] = $data['cbusiness_name'][$key];
            }
            if(isset($data['fgotra']) && $data['fgotra'])
            {
                $person['gotra'] = $data['fgotra'];
            }
            if(isset($data['fgotra_other']) && $data['fgotra_other']!='')
            {
                $person['gotra'] = $data['fgotra_other'];
            }
            if(isset($data['otherc']) && $data['otherc']!='')
            {
                $person['other-community'] = $data['otherc'];
            }
            $existanceAdvance = check_if_person_exists_basic( $person['name'] , $person['last_name'], $person['dob'], $person['father_name'], $person['father_last_name'], $person['father_dob'],$person['mother_name'], $person['mother_last_name'], $person['mother_dob']);
            if( $existanceAdvance['exists']==true)
            {   //update
                $uuid = $existanceAdvance['uuid'];
                if($person['gender']=='male'){
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Father]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofSUuid'}) MERGE (u)-[r:Mother]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUSuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
                    array_push($childBrother,$uuid);
                }
                else
                {
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Father]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofSUuid'}) MERGE (u)-[r:Mother]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUSuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
                    array_push($childSister,$uuid);
                }
            
                $cuid = $_POST['community'];
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
                
            }
            else
            {   $uuid = guidv4(random_bytes(16));
                $person['uuid'] = $uuid;
                $person = array_map('trim', $person);
                $client->run("CREATE (u:User) SET u += {infos}", ['infos' =>$person ]);
                if($person['gender']=='male'){
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Father]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofSUuid'}) MERGE (u)-[r:Mother]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUSuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
                    array_push($childBrother,$uuid);
                }
                else
                {
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Father]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofSUuid'}) MERGE (u)-[r:Mother]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUSuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
                    array_push($childSister,$uuid);
                }
                $cuid = $_POST['community'];
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
                
            }
        else:
            $person['father_title']     = $_POST['sstitle'];
            $person['father_name']      = $_POST['ssname'];
            $person['father_last_name'] = $data['sssurname'];
            $person['father_dob']       = $data['ssdob'];
            $person['mother_title']     = $_POST['title'];
            $person['mother_name']      = $_POST['name'];
            $person['mother_last_name'] = $data['surname'];
            $person['mother_dob']       = $data['dob'];
           
            if(isset($data['caadhar_no'][$key]) && $data['caadhar_no'][$key]!='')
            {
                $person['aadhar_no'] = $data['caadhar_no'][$key];
            }
            if(isset($data['cmobile_no'][$key]) && $data['cmobile_no'][$key]!='')
            {
                $person['mobile_no'] = $data['cmobile_no'][$key];
            }
            if(isset($data['cemail'][$key]) && $data['cemail'][$key]!='')
            {
                $person['email'] = $data['cemail'][$key];
            }
            if(isset($data['cyour_occupation'][$key]) && $data['cyour_occupation'][$key]!='')
            {
                $person['your_occupation'] = $data['cyour_occupation'][$key];
            }
            if(isset($data['cbusiness_name'][$key]) && $data['cbusiness_name'][$key]!='')
            {
                $person['business_name'] = $data['cbusiness_name'][$key];
            }
            if(isset($data['fgotra']) && $data['fgotra']!='')
            {
                $person['gotra'] = $data['fgotra'];
            }
            if(isset($data['fgotra_other']) && $data['fgotra_other']!='')
            {
                $person['gotra'] = $data['fgotra_other'];
            }
            if(isset($data['otherc']) && $data['otherc']!='')
            {
                $person['other-community'] = $data['otherc'];
            }
            $existanceAdvance = check_if_person_exists_basic( $person['name'] , $person['last_name'], $person['dob'], $person['father_name'], $person['father_last_name'], $person['father_dob'],$person['mother_name'], $person['mother_last_name'], $person['mother_dob']);
            if( $existanceAdvance['exists']==true)
            {   //update
                $uuid = $existanceAdvance['uuid'];
                if($person['gender']=='male'){
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Father]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofSUuid'}) MERGE (u)-[r:Mother]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUSuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
                    array_push($childBrother,$uuid);
                }
                else
                {
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Father]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofSUuid'}) MERGE (u)-[r:Mother]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUSuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
                    array_push($childSister,$uuid);
                }
            
                $cuid = $_POST['community'];
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
               
            }
            else
            {   $uuid = guidv4(random_bytes(16));
                $person['uuid'] = $uuid;
                $person = array_map('trim', $person);
                $client->run("CREATE (u:User) SET u += {infos}", ['infos' =>$person ]);
                if($person['gender']=='male'){
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Father]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofSUuid'}) MERGE (u)-[r:Mother]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUSuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
                    array_push($childBrother,$uuid);
                }
                else
                {
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Father]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofSUuid'}) MERGE (u)-[r:Mother]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
                    $client->run("MATCH (u:User {uuid:'$ofUSuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
                    array_push($childSister,$uuid);
                }
                $cuid = $_POST['community'];
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
                array_push();
            }
        endif;
    endforeach;
    /*Handle Child Brother*/
    handleBrothersRelation($childBrother);
    handleSistersRelation($childSister);
    handleBrotherSisterRelation($childBrother,$childSister);
}
function handleBrother($data,$ofUuid,$fuuid,$muuid){
    global $client;
    $brothers = [];
    foreach($data['bname'] as $key=>$value):
        if($value=='')
        continue;
        $person['title']            = $data['btitle'][$key];
        $person['name']             = $data['bname'][$key];
        $person['last_name']        = $data['bsurname'][$key];
        $person['dob']              = $data['bdob'][$key];
        $person['father_title']     = $_POST['ftitle'];
        $person['father_name']      = $_POST['fname'];
        $person['father_last_name'] = $data['fsurname'];
        $person['father_dob']       = $data['fdob'];
        $person['mother_title']     = $_POST['mtitle'];
        $person['mother_name']      = $_POST['mname'];
        $person['mother_last_name'] = $data['msurname'];
        $person['mother_dob']       = $data['mdob'];
        
        if(isset($data['bmarital_status'][$key]) && $data['bmarital_status'][$key]!='')
        {
            $person['marital_status'] = $data['bmarital_status'][$key];
        }
        if(isset($data['baadhar_no'][$key]) && $data['baadhar_no'][$key]!='')
        {
            $person['aadhar_no'] = $data['baadhar_no'][$key];
        }
        if(isset($data['bmobile_no'][$key]) && $data['bmobile_no'][$key]!='')
        {
            $person['mobile_no'] = $data['bmobile_no'][$key];
        }
        if(isset($data['bdate_of_marriage'][$key]) && $data['bdate_of_marriage'][$key]!='')
        {
            $person['date_of_marriage'] = $data['bdate_of_marriage'][$key];
        }
        if(isset($data['bemail'][$key]) && $data['bemail'][$key]!='')
        {
            $person['email'] = $data['bemail'][$key];
        }
        if(isset($data['byour_occupation'][$key]) && $data['byour_occupation'][$key]!='')
        {
            $person['your_occupation'] = $data['byour_occupation'][$key];
        }
        if(isset($data['byour_occupation'][$key]) && $data['byour_occupation'][$key]!='')
        {
            $person['occupation'] = $data['byour_occupation'][$key];
            if(strtolower($person['byour_occupation'][$key])=='other' && isset($data['byour_occupation_other'][$key]) && $data['byour_occupation_other'][$key]!='')
            {
                $person['occupation_other'] = $data['byour_occupation_other'][$key];
            }
            
        }
        if(isset($data['bbusiness_name'][$key]) && $data['bbusiness_name'][$key]!='')
        {
            $person['business_name'] = $data['bbusiness_name'][$key];
        }
        if(isset($data['fgotra']) && $data['fgotra']!='')
        {
            $person['gotra'] = $data['fgotra'];
        }
        if(isset($data['fgotra_other']) && $data['fgotra_other']!='')
        {
            $person['gotra'] = $data['fgotra_other'];
        }
        if(isset($data['otherc']) && $data['otherc']!='')
        {
            $person['other-community'] = $data['otherc'];
        }
        $existanceAdvance = check_if_person_exists_basic( $person['name'] , $person['last_name'], $person['dob'], $person['father_name'], $person['father_last_name'], $person['father_dob'],$person['mother_name'], $person['mother_last_name'], $person['mother_dob']);
        if( $existanceAdvance['exists']==true)
        {   //update
            $uuid = $existanceAdvance['uuid'];
            if($data['gender']=='male'){
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Brother]->(u1)");
                $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Brother]->(u1)");
            }
            else
            {
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Sister]->(u1)");
                $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Brother]->(u1)");
            }
            $cuid = $_POST['community'];
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$fuuid'}) MERGE (u)-[r:Father]->(u1)");
            $client->run("MATCH (u:User {uuid:'$fuuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$muuid'}) MERGE (u)-[r:Mother]->(u1)");
            $client->run("MATCH (u:User {uuid:'$muuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
            array_push($brothers,$uuid);  
        }
        else
        {   $uuid = guidv4(random_bytes(16));
            $person['uuid'] = $uuid;
            $person = array_map('trim', $person);
            $client->run("CREATE (u:User) SET u += {infos}", ['infos' =>$person ]);
            if($data['gender']=='male'){
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Brother]->(u1)");
                $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Brother]->(u1)");
               
            }
            else
            {
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Sister]->(u1)");
                $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Brother]->(u1)");
            }
            $cuid = $_POST['community'];
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 

            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$fuuid'}) MERGE (u)-[r:Father]->(u1)");
            $client->run("MATCH (u:User {uuid:'$fuuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$muuid'}) MERGE (u)-[r:Mother]->(u1)");
            $client->run("MATCH (u:User {uuid:'$muuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Son]->(u1)");
            array_push($brothers,$uuid);
        }
    endforeach;
    return $brothers;
}
function handleSister($data,$ofUuid,$fuuid,$muuid){
    global $client;
    $sisters = [];
     foreach($data['sname'] as $key=>$value):
        if($value=='')
        continue;
        $person['title']            = $data['stitle'][$key];
        $person['name']             = $data['sname'][$key];
        $person['last_name']        = $data['ssurname'][$key];
        $person['dob']              = $data['sdob'][$key];
        $person['father_title']     = $_POST['ftitle'];
        $person['father_name']      = $_POST['fname'];
        $person['father_last_name'] = $data['fsurname'];
        $person['father_dob']       = $data['fdob'];
        $person['mother_title']     = $_POST['mtitle'];
        $person['mother_name']      = $_POST['mname'];
        $person['mother_last_name'] = $data['msurname'];
        $person['mother_dob']       = $data['mdob'];

        if(isset($data['smarital_status'][$key]) && $data['smarital_status'][$key]!='')
        {
            $person['marital_status'] = $data['smarital_status'][$key];
        }
        if(isset($data['saadhar_no'][$key]) && $data['saadhar_no'][$key]!='')
        {
            $person['aadhar_no'] = $data['saadhar_no'][$key];
        }
        if(isset($data['smobile_no'][$key]) && $data['smobile_no'][$key]!='')
        {
            $person['mobile_no'] = $data['smobile_no'][$key];
        }
        if(isset($data['sdate_of_marriage'][$key]) && $data['sdate_of_marriage'][$key]!='')
        {
            $person['date_of_marriage'] = $data['sdate_of_marriage'][$key];
        }
        if(isset($data['semail'][$key]) && $data['semail'][$key]!='')
        {
            $person['email'] = $data['semail'][$key];
        }
        if(isset($data['syour_occupation'][$key]) && $data['syour_occupation'][$key]!='')
        {
            $person['occupation'] = $data['syour_occupation'][$key];
            if(strtolower($person['syour_occupation'][$key])=='other' && isset($data['syour_occupation_other'][$key]) && $data['syour_occupation_other'][$key]!='')
            {
                $person['occupation_other'] = $data['syour_occupation_other'][$key];
            }
            
        }
        if(isset($data['sbusiness_name'][$key]) && $data['sbusiness_name'][$key]!='')
        {
            $person['business_name'] = $data['sbusiness_name'][$key];
        }
        if(isset($data['fgotra']) && $data['fgotra']!='')
        {
            $person['gotra'] = $data['fgotra'];
        }
        if(isset($data['fgotra_other']) && $data['fgotra_other']!='')
        {
            $person['gotra'] = $data['fgotra_other'];
        }
        if(isset($data['otherc']) && $data['otherc']!='')
        {
            $person['other-community'] = $data['otherc'];
        }
        $existanceAdvance = check_if_person_exists_basic( $person['name'] , $person['last_name'], $person['dob'], $person['father_name'], $person['father_last_name'], $person['father_dob'],$person['mother_name'], $person['mother_last_name'], $person['mother_dob']);

        if( $existanceAdvance['exists']==true)
        {   //update
            $uuid = $existanceAdvance['uuid'];
            if($data['gender']=='male'){
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Brother]->(u1)");
                $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Sister]->(u1)");
            }
            else
            {
                $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Sister]->(u1)");
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Sister]->(u1)");
            }
            $cuid = $_POST['community'];
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$fuuid'}) MERGE (u)-[r:Father]->(u1)");
            $client->run("MATCH (u:User {uuid:'$fuuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$muuid'}) MERGE (u)-[r:Mother]->(u1)");
            $client->run("MATCH (u:User {uuid:'$muuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
            array_push($sisters,$uuid);
        }
        else
        {   $uuid = guidv4(random_bytes(16));
            $person['uuid'] = $uuid;
            $person = array_map('trim', $person);
            $client->run("CREATE (u:User) SET u += {infos}", ['infos' =>$person ]);
            if($data['gender']=='male'){
                $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$ofUuid'}) MERGE (u)-[r:Brother]->(u1)");
                $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Sister]->(u1)");
            }
            else
            {
                $client->run("MATCH (u:User {uuid:'$ofUuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Sister]->(u1)");
            }
            $cuid = $_POST['community'];
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:Community {cuid:'$cuid'}) MERGE (u)-[r:BELONGS]->(u1)"); 
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$fuuid'}) MERGE (u)-[r:Father]->(u1)");
            $client->run("MATCH (u:User {uuid:'$fuuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
            $client->run("MATCH (u:User {uuid:'$uuid'}),(u1:User {uuid:'$muuid'}) MERGE (u)-[r:Mother]->(u1)");
            $client->run("MATCH (u:User {uuid:'$muuid'}),(u1:User {uuid:'$uuid'}) MERGE (u)-[r:Daughter]->(u1)");
            array_push($sisters,$uuid);
        }
    endforeach;
    return $sisters;
}
function handleBrothersRelation($brothers)
{   global $client;
    $totalBrother = count($brothers);
    if($totalBrother>1)
    {
        foreach($brothers as $brother)
        {
            for($i=0;$i<$totalBrother;$i++)
            {
                if($brother==$brothers[$i])
                continue;
                $buuid1 = $brother;
                $buuid2 = $brothers[$i];
                $client->run("MATCH (u:User {uuid:'$buuid1'}),(u1:User {uuid:'$buuid2'}) MERGE (u)-[r:Brother]->(u1)");
                $client->run("MATCH (u:User {uuid:'$buuid2'}),(u1:User {uuid:'$buuid1'}) MERGE (u)-[r:Brother]->(u1)");
            }
        }
    }
    return false;
}
function handleSistersRelation($sisters)
{   global $client;
    $totalSister = count($sisters);
    if($totalSister>1)
    {
        foreach($sisters as $sister)
        {
            for($i=0;$i<$totalSister;$i++)
            {
                if($sister==$sisters[$i])
                continue;
                $buuid1 = $sister;
                $buuid2 = $sisters[$i];
                $client->run("MATCH (u:User {uuid:'$buuid1'}),(u1:User {uuid:'$buuid2'}) MERGE (u)-[r:Brother]->(u1)");
                $client->run("MATCH (u:User {uuid:'$buuid2'}),(u1:User {uuid:'$buuid1'}) MERGE (u)-[r:Brother]->(u1)");
            }
        }
    }
    return false;

}
function handleBrotherSisterRelation($brothers,$sisters){
    global $client;
    foreach($brothers as $buuid)
    {
        foreach($sisters as $suuid)
        {
            $client->run("MATCH (u:User {uuid:'$buuid'}),(u1:User {uuid:'$suuid'}) MERGE (u)-[r:Sister]->(u1)");
            $client->run("MATCH (u:User {uuid:'$suuid'}),(u1:User {uuid:'$buuid'}) MERGE (u)-[r:Brother]->(u1)");
        }
    }
    return false;
}
function getCommunity(){
    global $client;
    $result = $client->run("MATCH (n:Community) return n ORDER BY n.added_on");
    $records = $result->getRecords();
    $community = [];
    $gotra = [];
    foreach($records as $key=>$record){
        $communityObject = $record->values()[0];
        $communityArray = $communityObject->values();
        $community[$key] = array('uuid'=>$communityArray['cuid'],'name'=>$communityArray['name']);
        $cuid = $communityArray['cuid'];
        $gotra[$cuid] = [];
        $gresult = $client->run("MATCH (n:Gotra {cuid:'$cuid'}) return n.name ORDER BY TOLOWER(n.name)");
        $grecords = $gresult->getRecords();
     
        foreach($grecords as $key=>$grecord){
            $gotraObject = $grecord->values()[0];
            
            $gotra[$cuid][$key] = array('name'=>ucfirst($gotraObject));
        }
        
    }
    $response = [];
    $response['status'] = 'success';
    $response['data']['community'] = $community;
    $response['data']['gotra'] = $gotra;

    echo json_encode($response); die();
}
function handleMomDadRelation($fuuid,$muuid)
{
    global $client;
    $result = $client->run("MATCH (u:User {uuid:'$fuuid'}),(u1:User {uuid:'$muuid'}) MERGE (u)-[r:SPOUSE]->(u1)");
    $result = $client->run("MATCH (u:User {uuid:'$muuid'}),(u1:User {uuid:'$fuuid'}) MERGE (u)-[r:SPOUSE]->(u1)");
    return true;
}
function searchPeople($data){
    global $client;
    $query = strtolower($data['query']);
    $batch = $data['batch']*9;
    $totalRecords = 0;
    $queryString = "MATCH (n:User) WHERE ToLower(n.name) =~ '.*".$query.".*' OR ToLower(n.fullName) =~ '.*".$query.".*' OR TOLOWER(n.lastName) =~ '.*".$query.".*' OR TOLOWER(n.last_name) =~ '.*".$query.".*' ";
    
    $stringArray = explode(' ',$query);
    if(count($stringArray)==2)
    {
        $queryString .= " OR TOLOWER(n.name) =~ '.*".$stringArray[0].".*' AND TOLOWER(n.last_name) =~ '.*".$stringArray[1].".*'";   
    }
    if(count($stringArray)==3)
    {
        $queryString .= " OR (TOLOWER(n.name) =~ '.*".$stringArray[0]." ".$stringArray[1].".*' AND TOLOWER(n.last_name) =~ '.*".$stringArray[2].".*') OR (TOLOWER(n.name) =~ '.*".$stringArray[0].".*' AND TOLOWER(n.last_name) =~ '.*".$stringArray[1]." ".$stringArray[2].".*')";   
    } 
    $queryString .= " return count(n) as count";   
    $result = $client->run($queryString);
    $recordCount = $result->getRecord();
    $totalRecords = $recordCount->value('count'); 
   
    $queryString = "MATCH (n:User) WHERE ToLower(n.name) =~ '.*".$query.".*' OR ToLower(n.fullName) =~ '.*".$query.".*' OR TOLOWER(n.lastName) =~ '.*".$query.".*' OR TOLOWER(n.last_name) =~ '.*".$query.".*' ";
    $stringArray = explode(' ',$query);
    if(count($stringArray)==2)
    {
        $queryString .= " OR TOLOWER(n.name) =~ '.*".$stringArray[0].".*' AND TOLOWER(n.last_name) =~ '.*".$stringArray[1].".*'";   
    }
    if(count($stringArray)==3)
    {
        $queryString .= " OR (TOLOWER(n.name) =~ '.*".$stringArray[0]." ".$stringArray[1].".*' AND TOLOWER(n.last_name) =~ '.*".$stringArray[2].".*') OR (TOLOWER(n.name) =~ '.*".$stringArray[0].".*' AND TOLOWER(n.last_name) =~ '.*".$stringArray[1]." ".$stringArray[2].".*')";   
    } 
    $queryString .= " return n SKIP ".$batch." LIMIT 9";   
    $result = $client->run($queryString);
    $peopleRecords = $result->getRecords();
    $people = [];
    foreach($peopleRecords as $pplObjs)
    {   $pplObj = $pplObjs->values()[0];
        $temp = [];
        /*Full Name*/
        $temp['fullName'] = ucfirst($pplObj->value('name'));
        $temp['fullName'] .= ' ';
        $temp['fullName'] .= ucfirst($pplObj->value('last_name'));
       
        /*Marital Status*/
        
        if($pplObj->hasValue('marital_status'))
        {
            $temp['maritalStatus'] = $pplObj->value('marital_status');
        }
        else
        {
            $temp['maritalStatus'] = 'N/A';
        }
        /*Father Name*/
        if($pplObj->hasValue('father_name'))
        {
            $temp['father'] = strtolower($pplObj->value('father_name'));
            $temp['maritalStatus'] = 'm';
            $temp['father'] = ucfirst($temp['father']);
        }
        else
        {
            $temp['father'] = 'N/A';
        }
        /*UUID*/
        if($pplObj->hasValue('uuid'))
        {
            $temp['uuid'] = $pplObj->value('uuid');
        }
        else
        {
            $temp['uuid'] = 'N/A';
        }
        array_push($people,$temp);
    }
    $response = [];
    $response['status'] = 'true';
    $response['data'] =  ['total'=>$totalRecords,'batch'=>'0','people'=>$people];
    echo json_encode($response); die();
}
function searchPeopleEx($data){
    global $client;
    $query = strtolower($data['query']);
    $queryString = "MATCH (n:User) WHERE ToLower(n.name) =~ '.*".$query.".*' OR ToLower(n.fullName) =~ '.*".$query.".*' OR TOLOWER(n.lastName) =~ '.*".$query.".*' OR TOLOWER(n.last_name) =~ '.*".$query.".*' return n";
    $result = $client->run($queryString);
    $peopleRecords = $result->getRecords();
    $people = [];
    foreach($peopleRecords as $pplObjs)
    {   $pplObj = $pplObjs->values()[0];
        $temp = [];
        /*Full Name*/
        $temp['fullName'] = $pplObj->value('name');
        $temp['fullName'] .= ' ';
        $temp['fullName'] .= $pplObj->value('last_name');
       
        /*Marital Status*/
        if($pplObj->hasValue('marital_status'))
        {
            $temp['maritalStatus'] = $pplObj->value('marital_status');
        }
        else
        {
            $temp['maritalStatus'] = 'N/A';
        }
        /*Father Name*/
        if($pplObj->hasValue('father_name'))
        {
            $temp['father'] = $pplObj->value('father_name');
        }
        else
        {
            $temp['father'] = 'N/A';
        }
        /*UUID*/
        if($pplObj->hasValue('uuid'))
        {
            $temp['uuid'] = $pplObj->value('uuid');
        }
        else
        {
            $temp['uuid'] = 'N/A';
        }
        array_push($people,$temp);
    }
    $response = [];
    $response['status'] = 'true';
    $response['data'] =  ['total'=>'25','batch'=>'0','people'=>$people];
    echo json_encode($response); die();
}
function familyTreeEx($data)
{
    global $client;
    $uuid = $_REQUEST['uuid'];
    $result = $client->run("MATCH (u:User {uuid:'".$uuid."'}) return u");
    $record = $result->getRecord();
    $mainPerson = $record->values()[0];
    $mainPerson = $mainPerson->values(); // Main Person
    $result = $client->run("MATCH p=(u:User {uuid:'".$uuid."'})-[r]->(u1:User) RETURN distinct u1, type(r) LIMIT 25");
    $records = $result->getRecords();
    $members = [];
    $familyGraph = array(0=>'father',1=>'mother',2=>'spouse',3=>'sister',4=>'brother',5=>'son',6=>'daughter');
    foreach($records as $key=>$record)
    {
    $relation = strtolower($record->values()[1]);
    $relationKey = array_search($relation,$familyGraph);
    $memberObject = $record->values()[0];
    $member = $memberObject->values();
    $members[$relationKey][] = array('uuid'=>$member['uuid'],'name'=>trim($member['title'])." ".trim($member['name'])." ".trim($member['last_name']),'relation'=>$relation);
    }
    ksort($members,SORT_NUMERIC);
    /* Push Main Persons Data*/
    $person = [];
    $person['name'] =  trim($mainPerson['name'])." ".trim($mainPerson['last_name']);
    $person['uuid'] =  $mainPerson['uuid'];
    $person['relation'] =  'main';
    $person['parent'] =  'null';
    $person['children'] = [];
    if(isset($members[0]))
    {   /*Handle Father Node*/
        $father = current($members[0]);
        $father['parent'] = $person['name'];
        /*Handle Sister Node*/
        if(isset($members[3]))
        {   
            $father['children'] = [];
            foreach($members[3] as $valueSis ){
                $valueSis['parent'] = $father['name'];
                array_push($father['children'],$valueSis);
            }
        }
        /*Handle Brother Node*/
        if(isset($members[4]))
        {   $father['parent'] = $father['name'];
            if(!is_array($father['children']))
            {
                $father['children'] = [];
            }
            foreach($members[4] as $valueSis ){
                $valueSis['parent'] = $father['name'];
                array_push($father['children'],$valueSis);
            }
        }
        //Push Into Person
        $person['children'][] = $father;
    }
    if(isset($members[1]))
    {   /*Handle Mother Node*/
        $mother = current($members[1]);
        $mother['parent'] = $person['name'];
        //Push Into Person
        $person['children'][] = $mother;
    }
    if(isset($members[2]))
    {
        //Handle Spouse Node
        $spouse = current($members[2]);
        $spouse['parent'] = $person['name'];

        /*Handle Son Node*/
        if(isset($members[5]))
        {   $spouse['children'] = [];
            foreach($members[5] as $valueSis ){
                $valueSis['parent'] = $spouse['name'];
                array_push($spouse['children'],$valueSis);
            }
        }
        /*Handle Daughter Node*/
        if(isset($members[6]))
        {
            if(!is_array($spouse['children']))
            {
                $spouse['children'] = [];
            }
            foreach($members[6] as $valueSis ){
                $valueSis['parent'] = $spouse['name'];
                array_push($spouse['children'],$valueSis);
            }
        }
        //Push Into Person
        $person['children'][] = $spouse;
    }
    echo json_encode($person);
}
function memberNameSuggest($data){
    global $client;
    $data['userString'] = $data['userString'];
    $queryTotal = 'MATCH (u:User) WHERE NOT EXISTS (u.role) return count(u) as count';
    $results = $client->run($queryTotal);
    $records = $results->getRecord();
    $userCount = $records->values()[0];
    $query = 'MATCH (u:User)';
    if(isset($data['userString']) && $data['userString']!='')
   	{
        $string = strtolower($data['userString']);
        $query .= "WHERE TOLOWER(u.name) =~ '.*".$string.".*' OR TOLOWER(u.last_name) =~ '.*".$string.".*'";
        //Check if string array
        $stringArray = explode(' ',$string);
        if(count($stringArray)==2)
        {
            $query .= " OR (TOLOWER(u.name) =~ '.*".$stringArray[0].".*' AND TOLOWER(u.last_name) =~ '.*".$stringArray[1].".*')";   
        }
        if(count($stringArray)==3)
        {
            $query .= " OR (TOLOWER(u.name) =~ '.*".$stringArray[0]." ".$stringArray[1].".*' AND TOLOWER(u.last_name) =~ '.*".$stringArray[2].".*') OR (TOLOWER(u.name) =~ '.*".$stringArray[0].".*' AND TOLOWER(u.last_name) =~ '.*".$stringArray[1]." ".$stringArray[2].".*')";   
        }    
    }
    $query .= ' return u LIMIT 6';
    $results = $client->run($query);
    $records = $results->getRecords();
    $users = [];
    $response = [];
    if($records==''){
        $response['status'] = 0;
        $response['users'] = null;
        echo json_encode($response); die();       
    }
    else
    {   
        $response['status'] = 1;
        foreach($records as $record){
            $userObject = $record->values()[0];
            $name = $userObject->get('name');
            $lastName = $userObject->get('last_name');
            array_push($users,$name." ".$lastName);
        }
        $response['users'] = $users;
        echo json_encode($response); die();
    }
   
}
function advanceSearch($data){
    global $client;
    $data['name'] = $data['name'];
    $data['last_name'] = $data['last_name'];
    $community = $data['community'];
    $data['gender'] = $data['gender'];
    $startAge = $data['start_age'];
    $endAge = $data['end_age'];

    $query = strtolower($data['query']);
    $batch = $data['batch']*9;
    $totalRecords = 0;
    $currentYear = (int)date('Y');
    $startDate = date('m').'/'.date('d').'/'.($currentYear-$startAge);
    $endDate = date('m').'/'.date('d').'/'.($currentYear-$endAge);
   
    $queryString = "MATCH (n:User) WHERE (n)-[:BELONGS]-(:Community {cuid:'$community'}) AND apoc.date.parse(n.dob, 'ms', 'MM/dd/yy') < apoc.date.parse('$startDate', 'ms', 'MM/dd/yy') AND apoc.date.parse(n.dob, 'ms', 'MM/dd/yy') > apoc.date.parse('$endDate', 'ms', 'MM/dd/yy')";
    if($data['gender']=='male'){
        $queryString .= " AND (TOLOWER(n.gender) = 'male' OR TOLOWER(n.title) = 'mr') ";
    }
    else if($data['gender']=='female')
    {
        $queryString .= " AND (TOLOWER(n.gender) = 'female'  OR TOLOWER(n.title) = 'mrs' OR TOLOWER(n.title) = 'ms')";
    }
    $queryCountString = $queryString. " return count(n) as count";   
    $result = $client->run($queryCountString);
    $recordCount = $result->getRecord();
    $totalRecords = $recordCount->value('count'); 
    $queryString .= " return n SKIP ".$batch." LIMIT 9";   
    $result = $client->run($queryString);
    $peopleRecords = $result->getRecords();
    $people = [];
    foreach($peopleRecords as $pplObjs)
    {   $pplObj = $pplObjs->values()[0];
        $temp = [];
        /*Full Name*/
        $temp['fullName'] = $pplObj->value('name');
        $temp['fullName'] .= ' ';
        $temp['fullName'] .= $pplObj->value('last_name');
       
        /*Marital Status*/
        if($pplObj->hasValue('marital_status'))
        {
            $temp['maritalStatus'] = $pplObj->value('marital_status');
        }
        else
        {
            $temp['maritalStatus'] = 'N/A';
        }
        /*Father Name*/
        if($pplObj->hasValue('father_name'))
        {
            $temp['father'] = $pplObj->value('father_name');
        }
        else
        {
            $temp['father'] = 'N/A';
        }
        /*UUID*/
        if($pplObj->hasValue('uuid'))
        {
            $temp['uuid'] = $pplObj->value('uuid');
        }
        else
        {
            $temp['uuid'] = 'N/A';
        }
        array_push($people,$temp);
    }
    $response = [];
    $response['status'] = 'true';
    $response['data'] =  ['total'=>$totalRecords,'batch'=>'0','people'=>$people];
    echo json_encode($response); die();
   
}
function loginUser($data){
    global $client;
    $email = $data['email'];
    $password = $data['password'];
    $result = $client->run("MATCH (u:User {email:'$email'}) return u");
    $records = $result->getRecord();
    
    if($records!="")
    {
        $recordObject = $records->values()[0];
        $persons = $recordObject->values();
      
        if(!isset($persons['password']))
        {
            $response = [];
            $response['status'] = 0;
            $response['message'] = 'You don\'t have access for user login, please login administrator';
            echo json_encode($response); die();
        }
        else if(isset($persons['password']) && $persons['password']==$password)
        {
            
            $response = [];
            $response['status'] = 1;
            $response['message'] = 'User Login Successfully!';
            $response['data']=[];
            $response['data']['uuid'] = $persons['uuid'];
            $response['data']['full_name'] = $persons['name']." ".$persons['last_name'];

            $_SESSION['user'] = [];
            $_SESSION['user']['login'] = 1;
            $_SESSION['user']['user'] = $response['data']['uuid'];
            echo json_encode($response); die();
        }
        else
        {
            $response = [];
            $response['status'] = 0;
            $response['message'] = 'Invalid Password, Please try again!';
            echo json_encode($response); die();
        }
    }
    else
    {   
        $response = [];
        $response['status'] = 0;
        $response['message'] = 'Username/Password did not matched!';
        echo json_encode($response); die();
    }
}
function individualEditable($data)
{
    global $client;
    $uuid = $data['uuid'];
    $results = $client->run("MATCH (n:User {uuid:'$uuid'}) return n");
    $record = $results->getRecord();
    $userInfo = [];
    if($record!='')
    {
        $infoObject = $record->values()[0];
        $userInfo['self'] = $infoObject->values();
        $resultF = $client->run("MATCH (n:User {uuid:'$uuid'})-[:Father]-(f:User) return f");
        $recordF = $resultF->getRecord();
        if($recordF!='')
        {
            $infoObjectF = $recordF->values()[0];
            $userInfo['father'] = $infoObjectF->values();
        }
        else
        {
            $userInfo['father'] = false;
        }
        $resultC = $client->run("MATCH (n:User {uuid:'$uuid'})-[:BELONGS]-(c:Community) return c");
        $recordC = $resultC->getRecord();
        if($recordC!='')
        {
            $infoObjectC = $recordC->values()[0];
            $userInfo['self']['community'] = $infoObjectC->get('cuid');
        }
        else
        {
            $userInfo['self']['community'] = false;
        }

        $resultM = $client->run("MATCH (n:User {uuid:'$uuid'})-[:Mother]-(f:User) return f");
        $recordM = $resultM->getRecord();
        if($recordM!='')
        {
            $infoObjectM = $recordM->values()[0];
            $userInfo['mother'] = $infoObjectM->values();
        }
        else
        {
            $userInfo['mother'] = false;
        }
        $response = [];
        $response['status'] = 1;
        $response['message'] = 'Data found successfully!';
        $response['data'] = $userInfo;
        echo json_encode($response);
    }
    else
    {
        $response = [];
        $response['status'] = 0;
        $response['message'] = 'No data found!';
        echo json_encode($response);
    }
}
function individualInfo($data){
    global $client;
    $uuid = $data['uuid'];
    $results = $client->run("MATCH (n:User {uuid:'$uuid'}) return n");
    $record = $results->getRecord();
    $userInfo = [];
    if($record!='')
    {
        $infoObject = $record->values()[0];
        $infoArray = $infoObject->values();
        if(isset($infoArray['dob']))
        {   $dobOldFormat = $infoArray['dob'];
            $dobOldFormatArray = explode('/',$dobOldFormat);
            $from = new DateTime($dobOldFormatArray[2].'-'.$dobOldFormatArray[1].'-'.$dobOldFormatArray[0]);
            $to   = new DateTime('today');
            $age = $from->diff($to)->y;
            $userInfo['age'] = $age;
        }
        if(isset($infoArray['occupation']))
        {
            $userInfo['occupation'] = $infoArray['occupation'];
        }
        if(isset($infoArray['name_of_business']))
        {
            $userInfo['name_of_business'] = $infoArray['name_of_business'];
        }
        if(isset($infoArray['gotra']))
        {
            $userInfo['gotra'] = $infoArray['gotra'];
        }
        if(isset($infoArray['gotra']))
        {
            $userInfo['gotra'] = $infoArray['gotra'];
        }
        if(isset($infoArray['marital_status']))
        {
            $userInfo['marital_status'] = $infoArray['marital_status'];
        }
        if(isset($infoArray['qualification']))
        {
            $userInfo['qualification'] = $infoArray['qualification'];
        }
        if(isset($infoArray['category']))
        {
            $userInfo['category'] = $infoArray['category'];
        }
        $response = [];
        $response['status'] = 1;
        $response['message'] = 'Data found successfully!';
        $response['data'] = $userInfo;
        echo json_encode($response);
    }
    else
    {
        $response = [];
        $response['status'] = 0;
        $response['message'] = 'No data found!';
        echo json_encode($response);
    }
}
function updateUserInfo($data){
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
$data = $_POST;
$data['operation'] = 'update';
$master_uuid = handlePerson($data);
$response['status'] = 'success';
$response['message'] = 'Data Updated Successfully!';
$response['data'] = array('uuid'=>$master_uuid);
echo json_encode($response);
}