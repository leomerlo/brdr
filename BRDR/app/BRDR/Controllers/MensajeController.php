<?php

namespace BRDR\Controllers;

use BRDR\Auth\Auth;
use BRDR\Validation\Validator;
use BRDR\Security\Token;
use BRDR\Storage\Session;
use BRDR\Models\Mensajes;
use BRDR\Core\View;
use BRDR\Core\Route;
use BRDR\Core\App;
use Exception;

class MensajeController
{
	public function conversaciones(){
		try {
			$user_id = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

		try {
			$conversaciones = Mensajes::conversaciones($user_id);
			View::sendSuccess($conversaciones);
		} catch (Exception $e){
			View::sendError($e->getMessage());
		}
	}

	public function ver()
	{
		$data = Route::getParameters();
		$receptor = $data['user_id'];

		try {
			$emisor = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

		try {
			$mensajes = Mensajes::getHilo($emisor,$receptor);
			View::sendSuccess($mensajes);
		} catch (Exception $e){
			View::sendError($e->getMessage());
		}
	}

	public function enviar()
	{

		$data = Route::getParameters();
		$receptor = $data['user_id'];

		try {
			$emisor = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

		$input = file_get_contents('php://input');
		$postData = json_decode($input, true);

		$validator = new Validator($postData, [
			'mensaje' => ['required']
		]);

		if(!$validator->passes()) {
			View::sendValidatorError($validator->getErrors());
		}

		try {
			$mensaje = Mensajes::crear([
				'mensaje' 		=> $postData['mensaje'],
				'FK_emisor' 	=> $emisor,
				'FK_receptor' 	=> $receptor
			]);

			View::sendSuccess($mensaje);
		} catch (Exception $e) {
			View::sendError($e->getMessage());
		}
	}
}