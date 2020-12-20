<?php
namespace BRDR\Models;

use JsonSerializable;
use BRDR\DB\DBConnection;
use PDO;
use Exception;

/**
 * Favoritos
 */
class Favoritos extends Modelo implements JsonSerializable
{
	protected $table 		= "FAVORITOS";
	protected $primaryKey 	= "id";
	protected $userBind 	= "FK_USUARIO";
	protected $attributes 	= ['id', 'FK_POST', 'FK_USUARIO', 'fecha'];

	protected $id;
	protected $FK_POST;
	protected $FK_USUARIO;
	protected $fecha;

	public function getAllForUser($id){
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM FAVORITOS WHERE FK_USUARIO = ?" ;
		$stmt = $db->prepare($query);
		$stmt->execute([$id]);
		$salida = [];
		while($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$obj = new Favoritos;
			$obj->loadDataFromRow($fila);
			$salida[] = $obj;
		}
		return $salida;
	}

	/**
	 * Metodo para buscar un fav
	 *
	 * @param int $post_id
	 * @param int $user_id
	 * @return array
	 */
	public static function getOne($post_id,$user_id){
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM FAVORITOS WHERE activo = 1 AND FK_USUARIO = :FK_USUARIO AND FK_POST = :FK_POST LIMIT 1" ;
		$stmt = $db->prepare($query);
		$stmt->execute([
    	    'FK_POST' => $post_id,
    	    'FK_USUARIO' => $user_id,
    	]);
		$salida = [];
		while($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$obj = new Favoritos;
			$obj->loadDataFromRow($fila);
			$salida[] = $obj;
		}
		return $salida;
	}

	/**
	 * Metodo para ver si es fav
	 *
	 * @param int $post_id
	 * @param int $user_id
	 * @return array
	 */
	public static function isFav($post_id,$user_id){
		
		$fav = Favoritos::getOne($post_id,$user_id);

		if(sizeof($fav) > 0){
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Elimina un registro en la tabla.
	 *
	 * @param int $id
	 * @return static
	 * @throws Exception
	 */
	public static function delete($data)
	{
		$db = DBConnection::getConnection();
		$stmt = $db->prepare("DELETE FROM FAVORITOS WHERE FK_POST = :FK_POST AND FK_USUARIO = :FK_USUARIO" );

		$exito = $stmt->execute([
			'FK_POST' => $data['post_id'],
			'FK_USUARIO' => $data['user_id']
		]);

		if($exito) {
			return true;
		} else {
			var_dump($stmt->errorInfo());
			throw new Exception("Error al eliminar el registro.");
		}
	}

	/**
	 * Método de serialización a JSON.
	 */
	public function JsonSerialize()
	{

		$post = Posts::getOne($this->FK_POST);

		return [
			'id' 			=> $this->id,
			'post' 			=> $post
		];
	}
}