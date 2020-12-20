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
	protected $attributes 	= ['id', 'FK_USUARIO', 'FK_AMIGO'];

	protected $id;
	protected $FK_USUARIO;
	protected $FK_AMIGO;

	/**
     *
     * Listar amigos
     * 
     * @param $id
     * @return array;
     */

    public static function listarAmigos($id) {

        $db = DBConnection::getConnection();

        $query = "SELECT * FROM AMIGOS LEFT JOIN USUARIOS ON AMIGOS.FK_AMIGO = USUARIOS.id WHERE FK_USUARIO = ?";

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

        $query = "SELECT * FROM AMIGOS WHERE FK_USUARIO = :user_id AND FK_AMIGO = :amigo_id";

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

        $query = "SELECT * FROM POSTS WHERE FK_USUARIO IN ( SELECT FK_AMIGO FROM AMIGOS WHERE FK_USUARIO = ? )";

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
		$stmt = $db->prepare("DELETE FROM AMIGOS WHERE FK_USUARIO = :user_id AND FK_AMIGO = :amigo_id" );

		$exito = $stmt->execute([
        	'user_id' => $data['FK_USUARIO'],
        	'amigo_id' => $data['FK_AMIGO']
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

		$usuario 	= User::getById($this->FK_USUARIO);
		$amigo 		= User::getById($this->FK_AMIGO);
		
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