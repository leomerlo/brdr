<?php

namespace BRDR\Models;

use JsonSerializable;

use BRDR\Core\APP;
use BRDR\DB\DBConnection;
use BRDR\Storage\Session;
use BRDR\UserData\Images;
use Exception;
use PDO;

class Posts extends Modelo implements JsonSerializable
{
	protected $table 		= "POSTS";
	protected $primaryKey 	= "id";
	protected $userBind 	= "FK_USUARIO";
	protected $attributes 	= ['id', 'texto', 'fecha', 'activo', 'FK_USUARIO'];

	Protected $id;
	Protected $texto;
	Protected $fecha;
	Protected $FK_USUARIO;
	Protected $comentarios;

	/**
	 * Método de serialización a JSON.
	 */
	public function JsonSerialize()
	{

		$user = User::getById($this->FK_USUARIO);

		return [
			'id' 			=> $this->id,
			'texto' 		=> $this->texto,
			'fecha' 		=> $this->fecha,
			'usuario'		=> [
				'id' 		=> $user->get_id(),
				'username' 	=> $user->get_username()
			],
			'comentarios'	=> Comentarios::getAllFromParent($this->id),
		];
	}

	/**
	 * Buscar los posts de a 1
	 *
	 * @return array
	 */
	public static function getOne($id)
	{
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM POSTS WHERE id = ?";

		$stmt = $db->prepare($query);

		$stmt->execute([$id]);

		if($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$post = new Posts;
			$post->loadDataFromRow($fila);
			return $post;
		} else {
			throw new Exception("El post que estas buscando no existe.");
		}
	}

	/**
	 * Buscar los posts de a 10
	 *
	 * @return array
	 */
	public static function getAll($offset = 0)
	{
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM POSTS WHERE activo = 1 ORDER BY id DESC LIMIT ".$offset.",10";

		$stmt = $db->prepare($query);

		$stmt->execute();

		$salida = [];

		while($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$post = new Posts;
			$post->loadDataFromRow($fila);
			$salida[] = $post;
		}

		return $salida;
	}

	/**
	 * Extendemos la funcionalidad del create para subir la imagen
	 *
	 * @param array $data
	 * @return static
	 * @throws Exception
	 */
	public static function crear($data)
	{
		
		$db = DBConnection::getConnection();
		$stmt = $db->prepare("INSERT INTO POSTS (texto, fecha, FK_USUARIO) VALUES (:texto, NOW(), :FK_USUARIO)");
		$exito = $stmt->execute([
    	    'texto' => $data['texto'],
    	    'FK_USUARIO' => $data['FK_USUARIO'],
		]);
		
		try {
			if($exito) {
				$obj = new Posts;
				$obj->loadDataFromRow($data);
				$obj->id = $db->lastInsertId();
				$imageName = $obj->id;
				if(Images::upload($data['imagen'],$imageName)){
					return $obj;
				} else {
					$stmt = $db->prepare("DELETE FROM POSTS WHERE id = ?");
					$exito = $stmt->execute([$obj->id]);
					throw new Exception("Error al cargar la imagen.");
				}
			}
		} catch (\Throwable $th) {
			throw new Exception($th);
		}
	}

	/**
	 * Extendemos la funcionalidad del update para subir la imagen
	 *
	 * @param array $data
	 * @return static
	 * @throws Exception
	 */
	public static function update($data)
	{

		$obj = new static;
		$obj->getByPk($data['id']);
		if($obj->{$obj->userBind} != $data[$obj->userBind]){
			throw new Exception("El registro que intentas editar no te pertenece.");
		}
		
		$db = DBConnection::getConnection();
		$stmt = $db->prepare("UPDATE POSTS SET texto = :texto WHERE id = :id");
		$exito = $stmt->execute([
    	    'texto' => $data['texto'],
    	    'id' => $data['id']
    	]);

		if($exito) {
			$obj = new Posts($data['id']);
			return $obj;
		} else {
			throw new Exception("Error al actualizar el registro.");
		}
	}
}