<?php

namespace BRDR\Controllers;

use BRDR\Auth\Auth;
use BRDR\Validation\Validator;
use BRDR\Security\Token;
use BRDR\Storage\Session;
use BRDR\Models\Posts;
use BRDR\Core\View;
use BRDR\Core\Route;
use BRDR\Core\App;
use Exception;

class PostController
{
    public function index()
	{
		$posts = Posts::getAll();
		View::sendSuccess($posts);
	}

	public function ver()
	{
		$data = Route::getParameters();
		$id = $data['id'];

		try {
			$posts = Posts::getOne($id);
			View::sendSuccess($posts);
		} catch (Exception $e){
			View::sendError($e->getMessage());
		}
	}

	public function agregar()
	{	

		try {
			$user_id = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

		/* NO IMPLEMENTO PERMISOS AUN
		if(!Permisos::isAllowed('agregar')){
			View::sendError('No tenés los permisos necesarios para realizar esta acción');
		}
		*/

		$input = file_get_contents('php://input');
		$postData = json_decode($input, true);

		$validator = new Validator($postData, [
			'texto' => ['required'],
			'imagen' => ['required','type:jpeg']
		]);

		if(!$validator->passes()) {
			View::sendValidatorError($validator->getErrors());
		}

		try {
			$post = Posts::crear([
				'FK_USUARIO' 	=> $user_id,
				'texto' 		=> $postData['texto'],
				'imagen' 		=> $postData['imagen']
			]);

			View::sendSuccess($post);

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
			'id' 		=> ['required']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		$validator = new Validator($postData, [
			'texto' 	=> ['required']
		]);

		if(!$validator->passes()) {
			View::sendValidatorError($validator->getErrors());
		}

		try {
			$post = Posts::update([
				'id'			=> $data['id'],
				'texto' 		=> $postData['texto'],
				'FK_USUARIO'	=> $user_id
			]);
			View::sendSuccess($post);
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
			$post = Posts::delete([
				'id' 			=> $data['id'],
				'FK_USUARIO' 	=> $user_id
			]);

			View::sendSuccess('El post fue eliminado con éxito.');
		} catch (Exception $e) {
			View::sendError($e->getMessage());
		}
	}
}