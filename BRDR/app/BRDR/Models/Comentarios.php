<?php
namespace BRDR\Models;

use JsonSerializable;
use BRDR\DB\DBConnection;
use PDO;
use Exception;

/**
 * Comentarios
 */
class Comentarios extends Modelo implements JsonSerializable
{
	protected $table 		= "COMENTARIOS";
	protected $primaryKey 	= "id";
	protected $userBind 	= "FK_USUARIO";
	protected $attributes 	= ['id', 'texto', 'fecha', 'activo', 'FK_POST', 'FK_USUARIO'];

	protected $id;
	protected $texto;
	protected $fecha;
	protected $FK_POST;
	protected $FK_USUARIO;

	public function getAllFromParent($id){
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM COMENTARIOS WHERE activo = 1 AND FK_POST = ?" ;
		$stmt = $db->prepare($query);
		$stmt->execute([$id]);
		$salida = [];
		while($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$obj = new Comentarios;
			$obj->loadDataFromRow($fila);
			$salida[] = $obj;
		}
		return $salida;
	}

	public function JsonSerialize()
	{

		$user = User::getById($this->FK_USUARIO);
		
		return [
			'id' 			=> $this->id,
			'texto' 		=> $this->texto,
			'fecha' 		=> $this->fecha,
			'id_post'		=> $this->FK_POST,
			'usuario'		=> [
				'id' 		=> $user->get_id(),
				'username' 	=> $user->get_username()
			],
		];
	}
}