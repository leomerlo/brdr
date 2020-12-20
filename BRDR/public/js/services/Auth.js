angular.module('brdr.services')
.factory('Auth', [
	'$http',
	'API_SERVER',
	'Storage',
	function($http, API_SERVER, Storage) {
		let token = null;
		let userData = {
			id: null,
			nombre: null,
			email: null
		};

		tryLogFromStorage();

		/**
		 * Registra un usuario.
		 *
		 * @return {{}}
		 */
		let registro = function(user) {
			return $http.post(API_SERVER + "/registro", user).then(
				function(rta) {
					let response = rta.data;
					if(response.status == 0) {
						return {
							success: true
						};
					} else {
						return {
							success: false,
							status: response.status,
							error: response.message
						};
					}
				}
			);
		};

		/**
		 * Actualiza los datos del usuario.
		 *
		 * @return {{}}
		 */
		let update = function(user) {
			return $http.put(API_SERVER + "/perfil", user, {
				headers: { 
                    'x-token': getToken()
                }
            }).then(
				function(rta) {
					let response = rta.data;
					if(response.status == 0) {
						return {
							success: true
						};
					} else {
						return {
							success: false,
							status: response.status,
							error: response.message
						};
					}
				}
			);
		};

		/**
		 * Intenta loguear al usuario.
		 *
		 * @param {{}} user
		 * @return {Promise}
		 */
		let login = function(user) {
			return $http.post(API_SERVER + "/login", user).then(
				function(rta) {
					let response = rta.data;
					if(response.status == 0) {
						token = response.message.token;
						userData = {
							id: response.message.user.id,
							nombre: response.message.user.nombre,
							apellido: response.message.user.apellido,
							email: response.message.user.email,
							usuario: response.message.user.usuario
						};
						Storage.set('token', token);
						Storage.set('userData', userData);
						return {
							success: true
						};
					} else {
						return {
							success: false,
							status: response.status,
							error: response.message
						};
					}
				}
			);
		};

		/**
		 * Cierra la sesión.
		 */
		let logout = function() {
			Storage.remove('token');
			Storage.remove('userData');
			token = null;
			userData = {
				id: null,
				nombre: null,
				email: null
			};
		};

		/**
		 * Informa si el usuario esté logueado.
		 *
		 * @return {boolean}
		 */
		let isLogged = function() {
			return token !== null;
		};

		/**
		 * Retorna el token de autenticación.
		 *
		 * @return string|null
		 */
		let getToken = function() {
			return token;
		};

		/**
		 * Retorna la info del usuario autenticado.
		 *
		 * @return {{}}
		 */
		let getUserData = function() {
			return {
				id: userData.id,
				nombre: userData.nombre,
				email: userData.email
			};
		};

		/**
		 * Trata de loguear al usuario con datos de
		 * localStorage.
		 */
		function tryLogFromStorage() {
			if(Storage.has('token')) {
				token = Storage.get('token');
				userData = Storage.get('userData');
			}
		};

		return {
			registro 	: registro,
			update 		: update,
			login		: login,
			logout		: logout,
			isLogged	: isLogged,
			getToken	: getToken,
			getUserData	: getUserData
		};
	}
]);