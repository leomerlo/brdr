<?php

namespace BRDR\Core;

class View
{
	/**
	 * Renderiza la $data como JSON.
	 *
	 * @param mixed $data
	 */
	public static function renderJson($data,$status)
	{
		header("Content-Type: application/json; charset=utf-8");

		$data = [
			'status' => $status,
			'message' => $data
		];

		echo json_encode($data);
	}

	/**
	 * Envia mensaje de error.
	 *
	 * To Do - Implementar lista de errores.
	 *
	 * @param mixed $data
	 */
	public static function sendError($data){
		View::renderJson($data,-1);
		die();
	}

	/**
	 * Envia mensaje exitoso.
	 *
	 * @param mixed $data
	 */
	public static function sendSuccess($data){
		View::renderJson($data,0);
		die();
	}

	/**
	 * Envia alerta de usuario no autenticado.
	 *
	 * @param mixed $data
	 */
	public static function noAuth($data){
		View::renderJson($data,1);
		die();

	}

	/**
	 * Envia error de validacion de formulario.
	 *
	 * @param mixed $data
	 */
	public static function sendValidatorError($data){
		View::renderJson($data,2);
		die();

	}
}