<?php
namespace BRDR\Models;

use PDO;
use Exception;
use BRDR\DB\DBConnection;
use BRDR\Security\Hash;
use BRDR\UserData\Images;

/**
 * Maneja la tabla users.
 */
class User
{
	protected $id;
	protected $nombre;
	protected $apellido;
	protected $usuario;
	protected $email;
	protected $fecha;
	protected $password;
	protected $activo;

	private $ultima_visita;
	private $permisos;

	/**
	 * Obitene un usuario por su email.
	 *
	 * @param string $email
	 * @return User|null
	 */
	public function getByEmail($email)
	{
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM USUARIOS
				WHERE activo = 1 AND email = ?";
		$stmt = $db->prepare($query);
		$stmt->execute([$email]);
		if($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$this->setAttr('id',$fila['id']);
			$this->setAttr('nombre',$fila['nombre']);
			$this->setAttr('apellido',$fila['apellido']);
			$this->setAttr('usuario',$fila['usuario']);
			$this->setAttr('email',$fila['email']);
			$this->setAttr('password',$fila['password']);
			$this->setAttr('activo',$fila['activo']);
		} else {
			return null;
		}
	}

	/**
	 * Obitene un usuario por su id.
	 *
	 * @param string $id
	 * @return User|null
	 */
	public static function getById($id)
	{
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM USUARIOS
				WHERE id = ?";
		$stmt = $db->prepare($query);
		$stmt->execute([$id]);

		if($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$user = new User;
			$user->setAttr('id',$fila['id']);
			$user->setAttr('nombre',$fila['nombre']);
			$user->setAttr('apellido',$fila['apellido']);
			$user->setAttr('usuario',$fila['usuario']);
			$user->setAttr('email',$fila['email']);
			$user->setAttr('fecha',$fila['fecha']);
			$user->setAttr('password',$fila['password']);
			$user->setAttr('activo',$fila['activo']);
			return $user;
		} else {
			return null;
		}
	}

	/**
	 * Crea un nuevo usuario.
	 *
	 * @param array $data
	 * @return User
	 * @throws Exception
	 */
	public static function crear($data)
	{
		try {
			$db = DBConnection::getConnection();
			$query = "INSERT INTO USUARIOS (nombre, apellido, usuario, email, password, fecha, ultima_visita, FK_PERMISOS)
					VALUES (:nombre, :apellido, :usuario, :email, :password, NOW(), NOW(), 2)";
			$stmt = $db->prepare($query);
			$exito = $stmt->execute([
				'nombre' => $data['nombre'],
				'apellido' => $data['apellido'],
				'usuario' => $data['usuario'],
				'email' => $data['email'],
				'password' => Hash::make($data['password'])
			]);
		} catch (Exception $e) {
			var_dump($e->getMessage());
		}
		

		if(!$exito) {
			var_dump($db->getMessage());
			throw new Exception("Error al crear el usuario");
		}

		$user = new User;
		$user->id_user 	= $db->lastInsertId();
		$user->email 	= $data['email'];
		$user->password = $data['password'];

		return $user;
	}

	/**
	 * Actualiza la informacion del usuario
	 *
	 * @param array $data
	 * @return static
	 * @throws Exception
	 */
	public static function update($data)
	{	
		$db = DBConnection::getConnection();

    	if(isset($data['password'])){
			$stmt = $db->prepare("UPDATE USUARIOS SET nombre = :nombre, apellido = :apellido, usuario = :usuario, email = :email, password = :password WHERE id = :id");
			$exito = $stmt->execute([
	    	    'id' 		=> $data['id'],
	    	    'nombre' 	=> $data['nombre'],
	    	    'apellido' 	=> $data['apellido'],
	    	    'usuario' 	=> $data['usuario'],
	    	    'email' 	=> $data['email'],
	    	    'password' 	=> Hash::make($data['password'])
	    	]);   		
    	} else {
			$stmt = $db->prepare("UPDATE USUARIOS SET nombre = :nombre, apellido = :apellido, usuario = :usuario, email = :email WHERE id = :id");
			$exito = $stmt->execute([
	    	    'id' 		=> $data['id'],
	    	    'nombre' 	=> $data['nombre'],
	    	    'apellido' 	=> $data['apellido'],
	    	    'usuario' 	=> $data['usuario'],
	    	    'email' 	=> $data['email'],
	    	]);
    	}

		if($exito) {
			if(isset($data['imagen']) && $data['imagen'] != ''){
				if(Images::upload($data['imagen'],$data['id'],'user') ){
					return true;
				} else {
					throw new Exception("Error al cargar la imagen.");
				}
			}

			return true;
		} else {
			throw new Exception("Error al actualizar el registro.");
		}
	}

	/**
	 * Desactiva un usuario
	 *
	 * @param int $id
	 * @return static
	 * @throws Exception
	 */
	public static function delete($data)
	{

		$db = DBConnection::getConnection();
		$stmt = $db->prepare("UPDATE USUARIOS SET activo = 0 WHERE id = ?" );
		$exito = $stmt->execute([$data['id']]);

		if($exito) {
			return true;
		} else {
			var_dump($stmt->errorInfo());
			throw new Exception("Error al eliminar el usuario.");
		}
	}

	public static function validateUniqueEmail($email){
		$user = new User;
		$user->getByEmail($email);

		if($user->getAttr('id') != null){
			return true;
		} else {
			return false;
		}
	}

	public function getAttr($attr){
		return $this->{$attr};
	}

	private function setAttr($attr,$data){
		$this->{$attr} = $data;
		return $this;
	}

	public function get_id(){
		return $this->id;
	}

	public function get_username(){
		return $this->usuario;
	}

	public function get_nombre(){
		return $this->nombre;
	}

	public function get_apellido(){
		return $this->apellido;
	}

	public function get_email(){
		return $this->email;
	}
}