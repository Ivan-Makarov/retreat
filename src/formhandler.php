<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


$name = $_POST["name"];
$email = $_POST["email"];
$tel = $_POST["tel"];
$whereFrom = $_POST["where-from"];
$beenBefore = $_POST["been-before"];
$beforeDetails = $_POST["before-details"];
$room = $_POST["room"];
$comment = $_POST["comment"];

$msgOwner = 'Новая заявка на ретрит. Участник: ' . $name . ". Откуда: " . $whereFrom . ". Был на ретритах: " . $beenBefore . ". Подробности: " . $beforeDetails . ". Выбран номер: " . $room . ". Почта: " . $email . ". Телефон: " . $tel . ". Комментарий участника: " . $comment;
$msgOwnerAlt = $msgOwner;

$msgUser = "Добрый день, " . $name . '. Ваша заявка на ретрит "Практика внутренней тишины" принята. Мы свяжемся с вами в ближайшее время, чтобы уточнить все детали. Если вы не оставляли заявок, просто проигнорируйте это письмо.';
$msgUserAlt = $msgUser;

function sendEmailToOwner($msg) {
	require(__DIR__ . '/mailconfig.php');
	require 'vendor/autoload.php';
	$mail = new PHPMailer(true);

	try {
		$mail->IsSMTP();                                      
		$mail->Host = $mailconfig['host'];                 
		$mail->Port = $mailconfig['port'];                              
		$mail->SMTPAuth = true;                         
		$mail->Username = $mailconfig['username'];   
		$mail->Password = $mailconfig['password'];               
		$mail->SMTPSecure = 'ssl';                            

		$mail->From = $mailconfig['from'];
		$mail->FromName = $mailconfig['fromname'];
		$mail->AddAddress($mailconfig['from']); 

		$mail->IsHTML(true);                           
		$mail->CharSet = 'utf-8';

		$mail->Subject = 'Новая заявка на ретрит';
		$mail->Body    = $msg;
		$mail->AltBody = $msgAlt;

		$mail->send();
		echo $msg;
	} catch (Exception $e) {
		echo false;
	}	
}

function sendEmailToUser($msg, $msgAlt, $email) {
	require(__DIR__ . '/mailconfig.php');
	require 'vendor/autoload.php';
	$mail = new PHPMailer(true);

	try {
		$mail->IsSMTP();                                      
		$mail->Host = $mailconfig['host'];                 
		$mail->Port = $mailconfig['port'];                              
		$mail->SMTPAuth = true;                         
		$mail->Username = $mailconfig['username'];   
		$mail->Password = $mailconfig['password'];               
		$mail->SMTPSecure = 'ssl';                            

		$mail->From = $mailconfig['from'];
		$mail->FromName = $mailconfig['fromname'];
		$mail->AddAddress($email); 

		$mail->IsHTML(true);                           
		$mail->CharSet = 'utf-8';

		$mail->Subject = 'Заявка на "Практику внутренней тишины"';
		$mail->Body    = $msg;
		$mail->AltBody = $msgAlt;

		$mail->send();
		echo $msg;
	} catch (Exception $e) {
		echo false;
	}	
}

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
	sendEmailToUser($msgUser, $msgUserAlt, $email);
} 

sendEmailToOwner($msgOwner, $msgOwnerAlt)

?>
