<?php

namespace BRDR\Controllers;

use BRDR\Auth\Auth;
use BRDR\Validation\Validator;
use BRDR\Security\Token;
use BRDR\Models\Comentarios;
use BRDR\Core\View;
use BRDR\Core\Route;
use BRDR\Core\PDO;
use Exception;

class ComentarioController
{
    public function agregar()
	{
		$data = Route::getParameters();

		try {
			$user_id = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

		$input = file_get_contents('php://input');
        $postData = json_decode($input, true);

        $validator = new Validator($data, [
			'id' => ['required']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		$validator = new Validator($postData, [
			'texto' => ['required']
		]);

		if(!$validator->passes()) {
			View::sendValidatorError($validator->getErrors());
		}

		try {
			$comentario = Comentarios::crear([
				'FK_USUARIO' 	=> $user_id,
				'FK_POST' 		=> $data['id'],
				'texto' 		=> $postData['texto'],
			]);
			View::sendSuccess($comentario);
		} catch (Exception $e) {
			View::sendError($e->getMessage());
		}
	}

	public function editar()
	{
		$data = Route::getParameters();

		try {
			$user_id = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

		$input = file_get_contents('php://input');
        $postData = json_decode($input, true);

        $validator = new Validator($data, [
			'id' 	=> ['required']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		$validator = new Validator($postData, [
			'texto' => ['required']
		]);

		if(!$validator->passes()) {
			View::sendValidatorError($validator->getErrors());
		}

		try {
			$comentario = Comentarios::update([
				'id'			=> $data['id'],
				'texto'			=> $postData['texto'],
				'FK_USUARIO'	=> $user_id
			]);

			View::sendSuccess($comentario);
		} catch (Exception $e) {
			View::sendError($e->getMessage());
		}
	}

	public function eliminar()
	{
		$data = Route::getParameters();

		try {
			$user_id = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

		$validator = new Validator($data, [
			'id' 	=> ['required']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		try {
			$comentario = Comentarios::delete([
				'id' 			=> $data['id'],
				'FK_USUARIO' 	=> $user_id
			]);

			View::sendSuccess('El comentario fue eliminado con éxito.');
		} catch (Exception $e) {
			View::sendError($e->getMessage());
		}
	}

	public function get()
	{
		$comentarios = Comentarios::getAllFromParent($_GET);
	}
}