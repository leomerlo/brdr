<?php

namespace BRDR\Models;

use PDO;
use BRDR\DB\DBConnection;
use BRDR\Storage\Session;

class Permisos
{
	Protected $permisos;

	/**
	 * Chequea un permiso especifico del usuario
	 *
	 * @param array $data
	 * @return static
	 * @throws Exception
	 */
	public static function isAllowed($permiso,$id = SESSION::get('id'))
	{
		
		$db = DBConnection::getConnection();
		$stmt = $db->prepare("SELECT :permiso FROM PERMISOS WHERE id = :id");
		$exito = $stmt->execute([
			'permiso' = $permiso,
			'id' = $id
		]);

		if($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			if($fila[$permiso] == 1){
				return true;
			} else {
				return false;
			}
		}
	}

	public static function getPermisos()
	{

	}
}