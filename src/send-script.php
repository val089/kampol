<?php

$mailToSend = "kamilszerlag@gmail.com";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $telephone = $_POST["telephone"];
    $message = $_POST["message"];
    $antiSpam = $_POST["honey"];

    $errors = Array();
	$return = Array();

    if (empty($name)) {
        array_push($errors, "name");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        array_push($errors, "email");
    }
      if (empty($telephone)) {
        array_push($errors, "telephone");
    }
    if (empty($message)) {
        array_push($errors, "message");
    }

    if (empty($antiSpam)) {

        if (count($errors) > 0) {
            $return["errors"] = $errors;
        } else {
            $headers  = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type: text/html; charset=UTF-8". "\r\n";
            $headers .= "From: ".$email."\r\n";
            $headers .= "Reply-to: ".$email;
            $message  = "
                <html>
                    <head>
                        <meta charset=\"utf-8\">
                    </head>
                    <body>
                        <div><span style="font-weight: bold;">Imię i nazwisko:</span> $name</div>
                        <div><span style="font-weight: bold;">Email:</span> <a href=\"mailto:$email\">$email</a> </div>
                        <div><span style="font-weight: bold;">Telefon:</span> $telephone</div>
                        <div><span style="font-weight: bold;">Wiadomość:</span> </div>
                        <div> $message </div>
                    </body>
                </html>";

            if (mail($mailToSend, "Wiadomość ze strony - kampol-kasprzak.com.pl" . date("d-m-Y"), $message, $headers)) {
                $return["status"] = "ok";
            } else {
                $return["status"] = "error";
            }
        }
    } else {
        $return["status"] = "ok";
    }

    header("Content-Type: application/json");
    echo json_encode($return);
}