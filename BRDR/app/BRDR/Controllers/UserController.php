<?php

namespace BRDR\Controllers;

use BRDR\Auth\Auth;
use BRDR\Validation\Validator;
use BRDR\Storage\Session;
use BRDR\Security\Hash;
use BRDR\Models\Amigos;
use BRDR\Models\User;
use BRDR\Core\View;
use BRDR\Core\Route;
use BRDR\Core\App;

/**
* 
*/
class UserController
{

	public function agregar()
	{

		$input = file_get_contents('php://input');
        $postData = json_decode($input, true);

		$validator = new Validator($postData, [
			'nombre' 	=> ['required'],
			'apellido' 	=> ['required'],
			'email' 	=> ['required', 'unique:'.User::validateUniqueEmail($postData['email'])],
			'password' 	=> ['required', 'min:6']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		try {
			User::crear([
				'nombre' 	=> $postData['nombre'],
				'apellido' 	=> $postData['apellido'],
				'usuario' 	=> ($postData['usuario'] != '') ? $postData['usuario'] : substr($postData['nombre'],0,1) . $postData['apellido'],
				'email' 	=> $postData['email'],
				'password' 	=> $postData['password'],
				//'imagen' 	=> $postData['imagen'], La mandamos al edit
			]);
			
			View::sendSuccess('El usuario fue creado con éxito');
		} catch (Exception $e) {
			View::sendError($e->getMessage());
		}
	}

	public function perfil()
	{

		$data = Route::getParameters();

		try {
			$user_id = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

		if(isset($data['id'])){
			$user = User::getById($data['id']);
		} else {
			$user = User::getById($user_id);
		}

		$perfil = [
			'id' 		=> $user->get_id(),
			'nombre' 	=> $user->get_nombre(),
			'apellido' 	=> $user->get_apellido(),
			'usuario' 	=> $user->get_username(),
			'email' 	=> $user->get_email(),
			'es_amigo' 	=> Amigos::exists($user_id,$user->get_id())
		];

		View::sendSuccess($perfil);
	}

	public function editar()
	{
		try {
			$user_id = Auth::getUserId()['id'];
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

		$input = file_get_contents('php://input');
		$postData = json_decode($input, true);

		if(isset($postData['imagen']) && $postData['imagen'] != ''){
			$validator = new Validator($postData, [
				'nombre' 	=> ['required'],
				'apellido' 	=> ['required'],
				'imagen' 	=> ['required', 'type:jpeg']
			]);
		} else {
			$validator = new Validator($postData, [
				'nombre' 	=> ['required'],
				'apellido' 	=> ['required'],
			]);
		}

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		$data = [
			'id' 		=> $user_id,
			'nombre' 	=> $postData['nombre'],
			'apellido' 	=> $postData['apellido'],
			'email' 	=> $postData['email'],
			'usuario' 	=> ($postData['usuario'] != '') ? $postData['usuario'] : substr($postData['nombre'],0,1) . $postData['apellido'],
		];

		if(isset($postData['imagen']) && $postData['imagen'] != ''){
			$data['imagen'] = $postData['imagen'];
		}

		if(isset($postData['password']) && $postData['password'] != ''){
			$data['password'] = $postData['password'];
		}

		try {
			User::update($data);
			View::sendSuccess("El perfil fue editado con éxito.");
		} catch (Exception $e) {
			View::sendError($e->getMessage());
		}
	}

	public function eliminar()
	{
		try {
			$user_id = Auth::getUserId();
		} catch(Exception $e){
			View::noAuth($e->getMessage());
		}

		$input = file_get_contents('php://input');
        $postData = json_decode($input, true);

		$validator = new Validator($user_id, [
			'id' 	=> ['required']
		]);

		if(!$validator->passes()) {
			View::sendError($validator->getErrors());
		}

		try {
			User::delete([
				'id' => $user_id['id']
			]);

			View::sendSuccess('Tu cuenta fue cancelada.');
		} catch (Exception $e) {
			View::sendError($e->getMessage());
		}
	}

}