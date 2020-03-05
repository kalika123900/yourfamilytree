<?php

function sendLoginCredentials($email,$pwd,$mail){
    global $emailHost, $emailUsername, $emailPassword, $emailPort;
   
    $message ='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width">
    <meta name="format-detection" content="telephone=no">
    <!--[if !mso]>
        <!-->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800,300&subset=latin" rel="stylesheet" type="text/css">
    <!--<![endif]-->
    <title>Jet.com - Password Reset</title>
    <style type="text/css">
        *{
                    margin:0;
                    padding:0;
                    font-family:\'OpenSans-Light\', "Helvetica Neue", "Helvetica",Calibri, Arial, sans-serif;
                    font-size:100%;
                    line-height:1.6;
                }
                img{
                    max-width:100%;
                }
                body{
                    -webkit-font-smoothing:antialiased;
                    -webkit-text-size-adjust:none;
                    width:100%!important;
                    height:100%;
                }
                a{
                    color:#348eda;
                }
                .btn-primary{
                    text-decoration:none;
                    color:#FFF;
                    background-color:#a55bff;
                    border:solid #a55bff;
                    border-width:10px 20px;
                    line-height:2;
                    font-weight:bold;
                    margin-right:10px;
                    text-align:center;
                    cursor:pointer;
                    display:inline-block;
                }
                .last{
                    margin-bottom:0;
                }
                .first{
                    margin-top:0;
                }
                .padding{
                    padding:10px 0;
                }
                table.body-wrap{
                    width:100%;
                    padding:0px;
                    padding-top:20px;
                    margin:0px;
                }
                table.body-wrap .container{
                    border:1px solid #f0f0f0;
                }
                table.footer-wrap{
                    width:100%;
                    clear:both!important;
                }
                .footer-wrap .container p{
                    font-size:12px;
                    color:#666;
                }
                table.footer-wrap a{
                    color:#999;
                }
                .footer-content{
                    margin:0px;
                    padding:0px;
                }
                h1,h2,h3{
                    color:#660099;
                    font-family:\'OpenSans-Light\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif;
                    line-height:1.2;
                    margin-bottom:15px;
                    margin:40px 0 10px;
                    font-weight:200;
                }
                h1{
                    font-family:\'Open Sans Light\';
                    font-size:45px;
                }
                h2{
                    font-size:28px;
                }
                h3{
                    font-size:22px;
                }
                p,ul,ol{
                    margin-bottom:10px;
                    font-weight:normal;
                    font-size:14px;
                }
                ul li,ol li{
                    margin-left:5px;
                    list-style-position:inside;
                }
                .container{
                    display:block!important;
                    max-width:600px!important;
                    margin:0 auto!important;
                    clear:both!important;
                }
                .body-wrap .container{
                    padding:0px;
                }
                .content,.footer-wrapper{
                    max-width:600px;
                    margin:0 auto;
                    padding:20px 33px 20px 37px;
                    display:block;
                }
                .content table{
                    width:100%;
                }
                .content-message p{
                    margin:20px 0px 20px 0px;
                    padding:0px;
                    font-size:22px;
                    line-height:38px;
                    font-family:\'OpenSans-Light\',Calibri, Arial, sans-serif;
                }
                .preheader{
                    display:none !important;
                    visibility:hidden;
                    opacity:0;
                    color:transparent;
                    height:0;
                    width:0;
                }
    </style>
    </head>

    <body bgcolor="#f6f6f6">
    <span class="preheader" style="display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
        You’re back in the world of families.
    </span>

    <!-- body -->
    <table class="body-wrap" width="600">
        <tr>
        <td class="container" bgcolor="#FFFFFF">
            <!-- content -->
            <table border="0" cellpadding="0" cellspacing="0" class="contentwrapper" width="600">
            <tr>
                <td style="height:25px;">
                <img border="0" src="https://gallery.mailchimp.com/d42c37cf5f5c0fac90b525c8e/images/96288204-f67c-4ba2-9981-1be77c9fa18b.png" width="600">
                </td>
            </tr>
            <tr>
                <td>
                <div class="content">
                    <table class="content-message">
                    <tr>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="left">
                        <a href="https://jet.com">
                            <img src="http://www.yourfamilytree.in/app/assets/mockup-img/logo.png" width="250" border="0">
                        </a>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-message" style="font-family:\'Open Sans Light\',Calibri, Arial, sans-serif; color: #595959;">
                        <p>&nbsp;</p>
                        <p>
                            <img width="190" height="65" src="https://gallery.mailchimp.com/d42c37cf5f5c0fac90b525c8e/images/70ea32b8-20b3-4eb9-88d5-72089d8129d3.png" alt="Your Family Tree Credentials password" border="0">
                        </p>
                        <h1 style="font-family:\'OpenSans-Light\', Helvetica, Calibri, Arial, sans-serif;">
                                                Your Login Credentials
                                            </h1>

                        <p style="font-family: \'Open Sans\',\'Helvetica Neue\', \'Helvetica\',Calibri, Arial, sans-serif; font-size:18px; line-height:26px;">Email - '.$email.'</p>
                        <p style="font-family: \'Open Sans\',\'Helvetica Neue\', \'Helvetica\',Calibri, Arial, sans-serif; font-size:18px; line-height:26px;">Password - '.$pwd.'</p>
                        <table width="325" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                            <td width="325" height="60" bgcolor="#31cccc" style="text-align:center;">
                                <a href="http://www.yourfamilytree.in/loginpage" align="center" style="display:block; font-family:\'Open Sans\',Calibri, Arial, sans-serif;; font-size:20px; color:#ffffff; text-align: center; line-height:60px; display:block; text-decoration:none;">Login Now!</a>
                            </td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            </tr>
                        </table>
                        <p style="font-family: \'Open Sans\',\'Helvetica Neue\', \'Helvetica\',Calibri, Arial, sans-serif; font-size:18px; line-height:26px;">
                            <img border="0" src="https://gallery.mailchimp.com/d42c37cf5f5c0fac90b525c8e/images/4d4431c8-e778-47ac-a026-a869106b2903.gif" height="50" width="200">
                        </p>
                        <p style="font-family: \'Open Sans\',\'Helvetica Neue\', \'Helvetica\',Calibri, Arial, sans-serif; font-size:18px; line-height:26px;">How do you feel about the concept of family tree and what changes or suggestions would you like to get implemented, Email us at
                            <a href="mailto:yourfamilytree.in@gmail.com" style="color:#33CCCC; font-weight:bold; text-decoration:none; ">yourfamilytree.in@gmail.com</a>.</p>
                        </td>
                    </tr>
                    <tr>
                     <td align="center">
                       <img src="http://www.yourfamilytree.in/app/assets/mockup-img/center-img.png" width="230" />
                     </td>
                    </tr>
                    </table>
                </div>
                </td>
            </tr>
            
            </table>
            <!-- /content -->
        </td>
        <td></td>
        </tr>
    </table>
    <!-- /body -->
    </body>

    </html>';
    try {
       
        $mail->isSMTP();                                            // Send using SMTP
        $mail->Host       = $emailHost;                    // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = $emailUsername;                     // SMTP username
        $mail->Password   = $emailPassword;                               // SMTP password
        $mail->Port       = $emailPort;                                    // TCP port to connect to
        
        //Recipients
        $mail->setFrom($emailUsername, 'YourFamilyTree');
        $mail->addAddress($email, 'YFT Member');     // Add a recipient
    
    
        // Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'YourFamilyTree - Login Credentials';
        $mail->Body    = $message;
        $mail->AltBody = strip_tags($message);
    
        $res =  $mail->send();
        
        $response = [];
        $response['status'] = 'true';
        $response['message'] = 'Message has been sent';
        return json_encode($response);
        } catch (Exception $e) {
            $response = [];
            $response['status'] = false;
            $response['message'] = $mail->ErrorInfo;
            return json_encode($response);    
    }

}