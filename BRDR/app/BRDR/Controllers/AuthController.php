<?php

namespace BRDR\Controllers;

use BRDR\Core\App;
use BRDR\Core\View;
use BRDR\Validation\Validator;
use BRDR\Models\User;
use BRDR\Storage\Session;
use BRDR\Auth\Auth;
use Exception;

class AuthController
{

	public function login()
	{

		$input = file_get_contents('php://input');
        $postData = json_decode($input, true);

        $validator = new Validator($postData, [
			'email' => ['required'],
			'password' => ['required','min:6']
		]);

		if(!$validator->passes()) {
			View::sendValidatorError($validator->getErrors());
		}

		try {
			$login = Auth::login($postData['email'], $postData['password']);
			View::sendSuccess($login);
		} catch (Exception $e) {
			View::sendError('No se pudo loguear al usuario.');
		}

		// Error
	}

}