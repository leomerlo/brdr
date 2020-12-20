<?php

namespace BRDR\Core;

use Exception;

/**
 * Clase para manejar la app
 */
class App
{
	public static $rootPath;
	public static $appPath;
	public static $publicPath;
	public static $postImagesPath;
	public static $userImagesPath;
	//public static $viewsPath;
	public static $urlPath;

	protected $request;

	protected $controller;

	protected $controllerName;
	protected $controllerMethod;

	/** 
	 * Constructor
	 *
	 * @param string $rootPath
	 */
	public function __construct($rootPath)
	{
		self::$rootPath   = $rootPath;
		self::$appPath    = $rootPath . "/app";
		self::$publicPath = $rootPath . "/public/api";
		self::$postImagesPath = $rootPath . "/public/images/posts/";
		self::$userImagesPath = $rootPath . "/public/images/users/";

		$url = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . ':' . $_SERVER['SERVER_PORT'];

		self::$urlPath = $url;
	}

	/**
	 * Corremos la aplicacion
	 */
	public function run()
	{
		$this->request = new Request;
		$method = $this->request->getMethod();
		$url = $this->request->getUrl();

		if(Route::exists($method, $url)) {
			$controller = Route::getController($method, $url);
			list($this->controllerName, $this->controllerMethod) = explode('@', $controller);
			$this->runController($this->controllerName, $this->controllerMethod);
		} else {
			throw new Exception("El endpoint que estas buscando no existe en la API, revisá el manual en www.brdr.com/api");
		}
	}

	/**
	 * Ejecuta el controller.
	 *
	 * @param string $controller
	 * @param string $method
	 */
	public function runController($controller, $method)
	{
		// Primero, agregamos el namespace de los controllers.
		// Ej: \BRDR\Controllers\HomeController
		$controller = "\\BRDR\\Controllers\\" . $controller;

		// Instancio ese controller.
		// Ej: $this->controller = new \BRDR\Controllers\HomeController;
		$this->controller = new $controller;

		// Ejecutamos el método! :D
		// Ej: $method = 'index';
		// Ej: $this->controller->index();
		$this->controller->{$method}();
	}
}