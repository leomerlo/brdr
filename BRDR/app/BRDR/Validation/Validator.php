<?php
namespace BRDR\Validation;

class Validator
{
	/** @var array Los datos a validar */
	protected $data = [];

	/** @var array Las reglas de validación */
	protected $rules = [];

	/** @var array Los mensajes de error */
	protected $errors = [];

	/**
	 * Constructor.
	 *
	 * @param array $data La data a validar.
	 * @param array $rules Las reglas de validación.
	 */
	public function __construct($data, $rules)
	{
		$this->data = $data;
		$this->rules = $rules;
		$this->validate();
	}

	/**
	 * Ejecuta las validaciones.
	 */
	public function validate()
	{
		foreach($this->rules as $fieldName => $fieldRules) {
			foreach($fieldRules as $ruleName) {
				$this->executeRule($fieldName, $ruleName);
			}
		}
	}

	/**
	 * Ejecuta una regla de validación sobre un campo.
	 *
	 * @param string $fieldName El nombre del campo.
	 * @param string $ruleName El string de la regla de validación.
	 * @throws Exception
	 */
	public function executeRule($fieldName, $ruleName)
	{
		if(strpos($ruleName, ':') === false) {
			$methodName = "_" . $ruleName;

			// Verificamos que el método exista.
			if(!method_exists($this, $methodName)) {
				throw new Exception("La regla '" . $ruleName . "' no existe.");
				
			}

			$this->{$methodName}($fieldName);
		} else {
			$ruleData = explode(':', $ruleName);

			$methodName = "_" . $ruleData[0];
			// Verificamos que el método exista.
			if(!method_exists($this, $methodName)) {
				throw new Exception("La regla '" . $ruleName . "' no existe.");
				
			}

			$this->{$methodName}($fieldName, $ruleData[1]);
		}
	}

	/**
	 * Informa si la validación fue exitosa.
	 *
	 * @return bool
	 */
	public function passes()
	{
		if(count($this->errors) == 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Retorna los errores.
	 *
	 * @return array
	 */
	public function getErrors()
	{
		return $this->errors;
	}

	/**
	 * Agrega un mensaje de error de la validación.
	 *
	 * @param string $fieldName
	 * @param string $msg
	 */
	public function addError($fieldName, $msg)
	{
		// Verificamos si no existen errores para este campo.
		if(!isset($this->errors[$fieldName])) {
			$this->errors[$fieldName] = [];
		}

		// Pusheamos el dato al array.
		$this->errors[$fieldName][] = $msg;
	}

	/**
	 * Verifica que el campo no esté vacío.
	 *
	 * @param string $fieldName
	 */
	protected function _required($fieldName)
	{
		$value = $this->data[$fieldName];
		if(empty($value)) {
			// Error.
			$this->addError($fieldName, 'El campo ' . $fieldName . ' no debe estar vacío.');
		}
	}

	/**
	 * Verifica que el campo sea numérico.
	 *
	 * @param string $fieldName
	 */
	public function _numeric($fieldName)
	{
		$value = $this->data[$fieldName];
		if(!is_numeric($value)) {
			$this->addError($fieldName, 'El campo ' . $fieldName . " debe tener un valor numérico.");
		}
	}

	/**
	 * Verifica que tenga al menos $minLength caracteres.
	 *
	 * @param string $fieldName
	 * @param int $minLength
	 */
	public function _min($fieldName, $minLength)
	{
		$value = $this->data[$fieldName];
		if(strlen($value) < $minLength) {
			$this->addError($fieldName, 'El campo ' . $fieldName . " debe tener al menos " . $minLength . " caracteres.");
		}
	}

	/**
	 * Verifica que sea el tipo de contenido esperado
	 *
	 * @param string $fieldName
	 * @param string $type
	 */
	public function _type($fieldName, $type)
	{
		$value = strpos($this->data[$fieldName],$type);

		if(!$value) {
			$this->addError($fieldName, "La imagen solo acepta formato del tipo ". $type);
		}
	}

	/**
	 * Verifica que sea el tamaño no sea muy grande
	 *
	 * @param string $fieldName
	 * @param string $size
	 */
	public function _size($fieldName, $size)
	{
		$value = $this->data[$fieldName]['size'];

		if($value > $size) {
			$this->addError($fieldName, "La imagen debe pesar menos de ". ($type / 1000) ."kb" );
		}
	}

	/**
	 * Verifica que el email sea unico
	 *
	 * @param string $fieldName
	 * @param string $size
	 */
	public function _unique($fieldName, $valid)
	{
		$value = $this->data[$fieldName];

		if($valid) {
			$this->addError($fieldName, "El " . $fieldName . " ya existe en la base." );
		}
	}
}