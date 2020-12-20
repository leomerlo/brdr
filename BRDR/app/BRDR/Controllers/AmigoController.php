<?php

namespace BRDR\Controllers;

use BRDR\Auth\Auth;
use BRDR\Validation\Validator;
use BRDR\Security\Token;
use BRDR\Models\Amigos;
use BRDR\Core\View;
use BRDR\Core\Route;
use BRDR\Core\PDO;
use Exception;

class AmigoController
{
    public function agregar()
	{
		$data = Route::getParameters();

		try {
			$user_id = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

	    $validator = new Validator($data, [
			'user_id' => ['required']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		if(Amigos::exists($user_id,$data['user_id'])){
			View::sendError('Este usuario ya es tu amigo.');
		}

		try {
			$fav = Amigos::crear([
				'FK_usuario' 	=> $user_id,
				'FK_amigo' 		=> $data['user_id']
			]);
			View::sendSuccess('El usuario fue agregado a tu lista de amigos');
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
			'user_id' 	=> ['required']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		if(!Amigos::exists($user_id,$data['user_id'])){
			View::sendError('El usuario no es tu amigo.');
		}

		try {
			Amigos::delete([
				'FK_usuario' 	=> $user_id,
				'FK_amigo' 		=> $data['user_id']
			]);

			View::sendSuccess('El usuario fue eliminado a tu lista de amigos');
		} catch (Exception $e) {
			View::sendError($e->getMessage());
		}
	}

	public function exists()
	{
		$data = Route::getParameters();

		try {
			$user_id = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

	    $validator = new Validator($data, [
			'user_id' => ['required']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		
		View::sendSuccess(Amigos::exists($user_id,$data['user_id']));
	}

	public function listar()
	{

		if(!isset($data['user_id'])){
			$data['user_id'] = Auth::getUserId()['id'];
		}

		try {
			$post = Amigos::listarAmigos($data['user_id']);
			View::sendSuccess($post);
		} catch (Exception $e){
			View::sendError($e->getMessage());
		}
	}

	public function feed()
	{

		if(!isset($data['user_id'])){
			$data['user_id'] = Auth::getUserId()['id'];
		}

		try {
			$post = Amigos::getPostsAmigos($data['user_id']);
			View::sendSuccess($post);
		} catch (Exception $e){
			View::sendError($e->getMessage());
		}
	}
}