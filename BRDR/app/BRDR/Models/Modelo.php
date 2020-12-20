<?php

namespace BRDR\Models;

use BRDR\DB\DBConnection;
use PDO;
use Exception;

/**
 * Clase Base
 */
class Modelo
{
	protected $table = "";
	protected $primaryKey = "";
	protected $userBind = "";
	protected $attributes = [];

	/**
	 * Constructor.
	 *
	 * @param int|null $pk
	 */
	public function __construct($pk = null)
	{
		if(!is_null($pk)) {
			$this->getByPk($pk);
		}
	}

	/**
	 * Levanta un registro por la PK
	 *
	 * @param int $pk
	 */
	public function getByPk($pk)
	{
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM " . $this->table . "
				WHERE " . $this->primaryKey . " = ?";
		$stmt = $db->prepare($query);

		$exito = $stmt->execute([$pk]);

		if($exito) {
			$this->loadDataFromRow($stmt->fetch(PDO::FETCH_ASSOC));
		} else {
			throw new Exception("Error al obtener el objeto.");
		}
	}

	/**
	 * Carga el array en el objeto
	 *
	 * @param array $data
	 */
	public function loadDataFromRow($data)
	{
		foreach($this->attributes as $attr) {
			if(isset($data[$attr])) {
				$this->setAttr($attr,$data[$attr]);
			}
		}
	}

	/**
	 * Buscar todos los modelos
	 *
	 * @return array
	 */
	public static function getAll()
	{
		$self = new static;
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM " . $self->table;

		$stmt = $db->prepare($query);

		$stmt->execute();

		$salida = [];

		while($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$obj = new static;
			$obj->loadDataFromRow($fila);
			$salida[] = $obj;
		}

		return $salida;
	}

	/**
	 * Crea un registro nuevo en la tabla.
	 *
	 * @param array $data
	 * @return static
	 * @throws Exception
	 */
	public static function crear($data)
	{
		$insertQuery = self::generateInsertQuery($data);
		$insertData = self::filterData($data);

		$db = DBConnection::getConnection();
		$stmt = $db->prepare($insertQuery);

		$exito = $stmt->execute($insertData);

		if($exito) {
			$obj = new static;
			$obj->loadDataFromRow($data);
			$obj->{$obj->primaryKey} = $db->lastInsertId();
			return $obj;
		} else {
			return false;
		}
	}

	/**
	 * Edita un registro en la tabla.
	 *
	 * @param array $data
	 * @return static
	 * @throws Exception
	 */
	public static function update($data)
	{
		$updateQuery = self::generateUpdateQuery($data);
		$updateData = self::filterData($data);

		$obj = new static;
		if($obj->userBind){
			$obj->getByPk($data['id']);
			if($obj->{$obj->userBind} != $data[$obj->userBind]){
				throw new Exception("El registro que intentas editar no te pertenece.");
			}
		}

		$db = DBConnection::getConnection();
		$stmt = $db->prepare($updateQuery);

		$exito = $stmt->execute($updateData);

		if($exito) {
			$obj = new static;
			$obj->getByPk($data['id']);
			return $obj;
		} else {
			throw new Exception("Error al actualizar el objeto.");
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
		$obj = new static;
		if($obj->userBind){
			$obj->getByPk($data['id']);
			if($obj->{$obj->userBind} != $data[$obj->userBind]){
				throw new Exception("El registro que intentas editar no te pertenece.");
			}
		}

		$db = DBConnection::getConnection();
		$stmt = $db->prepare("UPDATE " . $obj->table . " SET activo = 0 WHERE id = ?" );

		$exito = $stmt->execute([$data['id']]);

		if($exito) {
			return true;
		} else {
			var_dump($stmt->errorInfo());
			throw new Exception("Error al eliminar el registro.");
		}
	}

	/**
	 * Genera el query de insert en base de los atributos definidos en
	 * $attributes.
	 *
	 * @param array $data
	 */
	public static function generateInsertQuery($data)
	{
		$self = new static;
		$query = "INSERT INTO " . $self->table . " (";
		$queryValues = " VALUES (";

		$insertFields = [];
		$holders = [];

		foreach ($data as $name => $value) {
			if(in_array($name, $self->attributes)) {
				$insertFields[] = $name;
				$holders[] = ":" . $name;
			}
		}

		$query .= implode(",", $insertFields) . ")";
		$query .= $queryValues . implode(",", $holders) . ")";

		return $query;
	}

	/**
	 * Genera el query de insert en base de los atributos definidos en
	 * $attributes.
	 *
	 * @param array $data
	 */
	public static function generateUpdateQuery($data)
	{
		$self = new static;
		$query = "UPDATE " . $self->table . " SET ";

		$updates = [];

		foreach ($data as $name => $value) {
			if(in_array($name, $self->attributes) && $name != $self->primaryKey) {
				$updates[] = $name . ' = :' .$name.' ';
			}
		}

		$query .= implode(",", $updates);
		$query .= "WHERE id = :id";

		return $query;
	}

	/**
	 * Retorna un array solo con los atributos que son data
	 *
	 * Bonus: Implementar con array_filter ;) ;)
	 *
	 * @param array $data
	 * @return array
	 */
	public static function filterData($data)
	{
		$self = new static;
		$output = [];

		foreach($data as $name => $value) {
			if(in_array($name, $self->attributes)) {
				$output[$name] = $value;
			}
		}

		return $output;
	}

	public function getAttr($property) {
		if (property_exists($this, $property)) {
		  return $this->{$property};
		}
	}

	public function setAttr($property, $value) {
		if (property_exists($this, $property)) {
		  $this->{$property} = $value;
		}

		return $this;
	}
}