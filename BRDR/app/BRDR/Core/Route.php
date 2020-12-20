<?php

namespace BRDR\Core;

/**
 * Se encarga de la administración de las rutas.
 */
class Route
{
	protected static $routes = [
		'GET'    => [],
		'POST'   => [],
		'PUT' 	 => [],
		'DELETE' => [],
	];

	/** @var array Los parámetros de la ruta, en caso de haberlos. */
	protected static $parameters = [];

	/** @var string El nombre y método del controller que corresponde a la ruta. */
	protected static $controllerAction;

	/**
	 * Registra la ruta.
	 *
	 * @param string $method
	 * @param string $url
	 * @param string $controller 	Con el formato "NombreController@nombreMétodo".
	 */
	public static function add($method, $url, $controller)
	{
		$method = strtoupper($method);
		self::$routes[$method][$url] = $controller;
	}

	/**
	 * Verifica si existe la ruta.
	 *
	 * @param string $method
	 * @param string $url
	 * @return boolean
	 */
	public static function exists($method, $url)
	{
		if(isset(self::$routes[$method][$url])) {
			return true;
		} else if(self::parameterizedRouteExists($method, $url)) {
			return true;
		} else {
			return false;
		}
		// return isset(self::$routes[$method][$url]);
	}

	/**
	 * Informa si existe una ruta que matchee $url, teniendo en cuenta
	 * los parámetros ({valor}).
	 *
	 * @param string $method
	 * @param string $url
	 * @return boolean
	 */
	public static function parameterizedRouteExists($method, $url)
	{
		$routesToCheck = self::$routes[$method];
		$urlParts = explode('/', $url);
		foreach($routesToCheck as $route => $controllerAction) {
			$routeParts = explode('/', $route);

			if(count($urlParts) == count($routeParts)) {
				if(self::compareParts($urlParts, $routeParts)) {
					self::$controllerAction = $controllerAction;
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Compara si las partes de la ruta matchean las partes de la url, contando
	 * los parámetros.
	 *
	 * @param array $urlParts
	 * @param array $routeParts
	 * @return boolean
	 */
	public static function compareParts($urlParts, $routeParts)
	{
		$parameters = [];

		foreach($routeParts as $key => $value) {
			if($value != $urlParts[$key]) {
				if(strpos($value, '{') === 0) {
					$parameterName = substr($value, 1, -1);
					$parameters[$parameterName] = $urlParts[$key];
				} else {
					return false;
				}
			}
		}

		self::$parameters = $parameters;
		return true;
	}

	/**
	 * Retorna el nombre del controller con su método con el formato:
	 * "Controller@método".
	 *
	 * @param string $method
	 * @param string $url
	 * @return string
	 */
	public static function getController($method, $url)
	{
		if(!empty(self::$controllerAction)) {
			return self::$controllerAction;
		}

		return self::$routes[$method][$url];
	}

	/**
	 * Retorna los parámetros de la url.
	 *
	 * @return array
	 */
	public static function getParameters()
	{
		return self::$parameters;
	}
}