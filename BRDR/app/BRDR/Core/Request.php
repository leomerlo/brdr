<?php

namespace BRDR\Core;

// use BRDR\Core\App;

/**
 * Se encarga de los datos de la petición.
 *
 * Ej:
 * - La url
 * - El verbo
 */
class Request
{
	protected $url;
	protected $method;

	/**
	 * Constructor.
	 */
	public function __construct()
	{
		$this->method = $_SERVER['REQUEST_METHOD'];

		// Vemos de recortar la URL.
		$absolutePath = $_SERVER['DOCUMENT_ROOT'] . $_SERVER['REQUEST_URI'];

		// MAGIA.
		$this->url = str_replace(App::$publicPath, '', $absolutePath);
	}

	/**
	 * @return string
	 */
	public function getMethod()
	{
		return $this->method;
	}

	/**
	 * @return string
	 */
	public function getUrl()
	{
		return $this->url;
	}
}