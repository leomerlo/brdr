<?php

namespace BRDR\Auth;

use BRDR\Models\User;
use BRDR\Security\Hash;
use BRDR\Security\Token;
use BRDR\Storage\Session;
use BRDR\Core\View;
use Exception;

class Auth
{
	/**
	 * Intenta loguear al usuario.
	 *
	 * @param string $email
	 * @param string $password
	 * @return boolean
	 */
	public static function login($email, $password)
	{
		$user = new User;
		$user->getByEmail($email);

		if($user !== null) {
			if(Hash::verify($password, $user->getAttr('password'))) {
				return [
					'token' => self::logUser($user),
					'user' => [
						'id' => $user->get_id(),
						'nombre' => $user->get_nombre(),
						'apellido' => $user->get_apellido(),
						'email' => $user->get_email(),
						'usuario' => $user->get_username()
					]
				];
			}
		}

		throw new Exception("No existe ningún usuario con ese email.");
	}

	/**
	 * Marca al usuario como logueado.
	 *
	 * @param User $user
	 */
	public static function logUser($user)
	{
		$token = new Token();
		return $token->create($user->getAttr('id'));
	}

	/**
	 * Obtiene el id del usuario logueado.
	 *
	 * @return int
	 */
	public static function getUserId()
	{
		$token = new Token();
		$user_token = $_SERVER['HTTP_X_TOKEN'];

		if($user_token === null || !$token->validate($user_token)) {
			throw new Exception("Necesitas estar logueado para realizar esta accion.");
		}

		return $token->validate($user_token);
	}

	/**
	 * Revisa si hay un usuario logueado.
	 *
	 * @return int
	 */
	public static function isUserLogged()
	{
		$token = new Token();
		$user_token = $_SERVER['HTTP_X_TOKEN'];

		if($user_token === null || !$token->validate($user_token)) {
			return false;
		} else {
			return $token->validate($user_token);
		}
	}
}