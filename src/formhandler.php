<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


$name = $_POST["name"];
$comment = $_POST["comment"];
$contact = $_POST["contact"];

$msgOwner = 'Новая заявка на ретрит. Участник: ' . $name . ". Контакт: " . $contact . ". Комментарий участника: " . $comment;
$msgOwnerAlt = $msgOwner;

$msgUser = "Добрый день, " . $name . '. Ваша заявка на ретрит "Практика внутренней тишины" принята. Мы свяжемся с вами в ближайшее время, чтобы уточнить все детали. Если вы не оставляли заявок, просто проигнорируйте это письмо.';
$msgUSerAlt = $msgUser;

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
		$mail->AddAddress('ivan.s.makarov@yandex.ru'); 

		$mail->IsHTML(true);                           
		$mail->CharSet = 'utf-8';

		$mail->Subject = 'Новая заявка на випассану';
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

		$mail->Subject = 'Спасибо за регистрацию на "Практику внутренней тишины"';
		$mail->Body    = $msg;
		$mail->AltBody = $msgAlt;

		$mail->send();
		echo $msg;
	} catch (Exception $e) {
		echo false;
	}	
}

if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
	sendEmailToUser($msgUser, $msgUserAlt, $contact);
} 

sendEmailToOwner($msgOwner, $msgOwnerAlt)

?>
