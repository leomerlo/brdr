<?php
namespace BRDR\Models;

use JsonSerializable;
use BRDR\DB\DBConnection;
use PDO;
use Exception;

/**
 * Amigos
 */
class Amigos extends Modelo implements JsonSerializable
{
	protected $table 		= "Amigos";
	protected $primaryKey 	= "id";
	protected $attributes 	= ['id', 'FK_usuario', 'FK_amigo'];

	protected $id;
	protected $FK_usuario;
	protected $FK_amigo;

	/**
     *
     * Listar amigos
     * 
     * @param $id
     * @return array;
     */

    public static function listarAmigos($id) {

        $db = DBConnection::getConnection();

        $query = "SELECT * FROM AMIGOS LEFT JOIN USUARIOS ON AMIGOS.FK_amigo = USUARIOS.id WHERE FK_usuario = ?";

        $stmt = $db->prepare($query);
        $stmt->execute([$id]);

        $salida = [];
		while($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$obj = new Amigos;
			$obj->loadDataFromRow($fila);
			$salida[] = $obj;
		}
		return $salida;
    }

    /**
     *
     * Listar amigos
     * 
     * @param $user el id del usuario logueado
     * @param $user el id del amigo
     * @return array;
     */

    public static function exists($user,$amigo) {

        $db = DBConnection::getConnection();

        $query = "SELECT * FROM AMIGOS WHERE FK_usuario = :user_id AND FK_amigo = :amigo_id";

        $stmt = $db->prepare($query);
        $stmt->execute([
        	'user_id' => $user,
        	'amigo_id' => $amigo
        ]);

        $fila = $stmt->fetch(PDO::FETCH_ASSOC);

        if($fila){
        	return true;
        } else {
        	return false;
        }
    }

    /**
     *
     * Posts de amigos
     * 
     * @param $data
     * @return array;
     */

    public static function getPostsAmigos($data) {

        $db = DBConnection::getConnection();

        $query = "SELECT * FROM POSTS WHERE FK_usuario IN ( SELECT FK_amigo FROM AMIGOS WHERE FK_usuario = ? )";

        $stmt = $db->prepare($query);
        $stmt->execute([$data]);

        $salida = [];
		while($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$obj = new Comentarios;
			$obj->loadDataFromRow($fila);
			$salida[] = $obj;
		}
		return $salida;
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
		$stmt = $db->prepare("DELETE FROM AMIGOS WHERE FK_usuario = :user_id AND FK_amigo = :amigo_id" );

		$exito = $stmt->execute([
        	'user_id' => $data['FK_usuario'],
        	'amigo_id' => $data['FK_amigo']
        ]);

		if($exito) {
			return true;
		} else {
			var_dump($stmt->errorInfo());
			throw new Exception("Error al eliminar el registro.");
		}
	}

	public function JsonSerialize()
	{
		$usuario 	= User::getById($this->FK_usuario);
		$amigo 		= User::getById($this->FK_amigo);
		
		return [
			'id' 			=> $this->id,
			'usuario' 		=> [
				'id' 		=> $usuario->get_id(),
				'username' 	=> $usuario->get_username()
			],
			'amigo' 		=> [
				'id' 		=> $amigo->get_id(),
				'username' 	=> $amigo->get_username()
			]
		];
	}
}