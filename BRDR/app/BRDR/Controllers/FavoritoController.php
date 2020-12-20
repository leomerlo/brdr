<?php

namespace BRDR\Controllers;

use BRDR\Auth\Auth;
use BRDR\Validation\Validator;
use BRDR\Security\Token;
use BRDR\Models\Favoritos;
use BRDR\Models\Posts;
use BRDR\Core\View;
use BRDR\Core\Route;
use BRDR\Core\PDO;
use Exception;

class FavoritoController
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
			'post_id' => ['required']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		Posts::getOne($data['post_id']);

		$exists = Favoritos::getOne($data['post_id'],$user_id);

		if(sizeof($exists) > 0){
			View::sendError('El post ya esta en tus favoritos');
		}

		try {
			$fav = Favoritos::crear([
				'FK_USUARIO' 	=> $user_id,
				'FK_POST' 		=> $data['post_id']
			]);
			View::sendSuccess('El post fue agregado a tus favoritos.');
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
			'post_id' 	=> ['required']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		$exists = Favoritos::getOne($data['post_id'],$user_id);

		if(sizeof($exists) < 1){
			View::sendError('El post no esta en tus favoritos');
		}

		try {
			$comentario = Favoritos::delete([
				'post_id' 	=> $data['post_id'],
				'user_id' 	=> $user_id
			]);

			View::sendSuccess('El post fue eliminado de tus favoritos.');
		} catch (Exception $e) {
			View::sendError($e->getMessage());
		}
	}

	public function get()
	{

		$data = Route::getParameters();

		if(!isset($data['user_id'])){
			$data['user_id'] = Auth::getUserId()['id'];
		}

		try {
			$favs = Favoritos::getAllForUser($data['user_id']);
			View::sendSuccess($favs);
		} catch (Exception $e){
			View::sendError($e->getMessage());
		}
	}
}