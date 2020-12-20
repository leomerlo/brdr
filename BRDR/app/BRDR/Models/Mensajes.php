<?php
namespace BRDR\Models;

use JsonSerializable;
use BRDR\DB\DBConnection;
use PDO;
use Exception;

/**
 * Mensajes
 */
class Mensajes extends Modelo implements JsonSerializable
{
	protected $table 		= "MENSAJES";
	protected $primaryKey 	= "id";
	protected $userBind 	= "FK_emisor";
	protected $attributes 	= ['id', 'FK_emisor', 'FK_receptor', 'mensaje', 'fecha', 'activo'];

	protected $id;
	protected $FK_emisor;
	protected $FK_receptor;
	protected $mensaje;
	protected $fecha;

	public function conversaciones($id){
		$db = DBConnection::getConnection();
		$query = "SELECT a.* FROM  `MENSAJES` a INNER JOIN ( SELECT MAX(  `id` ) AS id FROM  `MENSAJES` AS  `alt` WHERE `alt`.`FK_receptor` =:id OR  `alt`.`FK_emisor` =:id GROUP BY  least(`FK_receptor` ,  `FK_emisor`), greatest(`FK_receptor` ,  `FK_emisor`) )b ON a.id = b.id";
		$stmt = $db->prepare($query);
		$stmt->execute([
			'id' => $id
		]);
		$salida = [];
		while($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$obj = new Mensajes;
			$obj->loadDataFromRow($fila);
			$salida[] = $obj;
		}
		return $salida;
	}

	public function getHilo($emisor,$receptor){
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM MENSAJES WHERE ((FK_emisor = :emisor AND FK_receptor = :receptor) OR (FK_receptor = :emisor AND FK_emisor = :receptor)) AND activo = 1 ORDER BY fecha ASC" ;
		$stmt = $db->prepare($query);
		$stmt->execute([
			'emisor' => $emisor,
			'receptor' => $receptor
		]);
		$salida = [];
		while($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$obj = new Mensajes;
			$obj->loadDataFromRow($fila);
			$salida[] = $obj;
		}
		return $salida;
	}

	/**
	 * Método de serialización a JSON.
	 */
	public function JsonSerialize()
	{

		$receptor = User::getById($this->get_receptor());
		$emisor = User::getById($this->get_emisor());

		return [
			'id' 			=> $this->id,
			'mensaje' 		=> $this->mensaje,
			'fecha' 		=> $this->fecha,
			'emisor' 		=> [
				'id' 		=> $emisor->get_id(),
				'usuario' 	=> $emisor->get_username()
			],
			'receptor' 		=> [
				'id' 		=> $receptor->get_id(),
				'usuario' 	=> $receptor->get_username()
			]
		];
	}

	public function get_receptor(){
		return $this->FK_receptor;
	}

	public function get_emisor(){
		return $this->FK_emisor;
	}
}