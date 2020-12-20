angular.module('brdr', ['ionic', 'brdr.directives', 'brdr.controllers', 'brdr.services'])

.run(function($ionicPlatform, $ionicPopup, $rootScope, $state, Auth) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.$on('$stateChangeStart', function(ev, nuevoState, nuevoStateParams, actualState) {
      if(nuevoState.data !== undefined && nuevoState.data.requireAuth === true) {
        if(!Auth.isLogged()) {
          ev.preventDefault();
          $state.go('login');
        }
      }
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('registro', {
    url: '/registro',
    templateUrl: 'templates/registro.html',
    controller: 'RegistroCtrl'
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.feed', {
    url: '/feed',
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-feed.html',
        controller: 'FeedCtrl'
      }
    }
  })

    .state('tab.comentarios', {
      url: '/feed/:id',
      views: {
        'tab-feed': {
          templateUrl: 'templates/comentarios.html',
          controller: 'ComentarioCtrl'
        }
      }
    })

    .state('tab.editar', {
      url: '/detalle/:id',
      views: {
        'tab-feed': {
          templateUrl: 'templates/tab-editar.html',
          controller: 'EdicionCtrl'
        }
      }
    })

  .state('tab.new', {
    url: '/new',
    data: {
      requireAuth: true
    },
    views: {
      'tab-new': {
        templateUrl: 'templates/tab-new.html',
        controller: 'NewCtrl'
      }
    }
  })

  .state('tab.profile', {
    url: '/profile',
    data: {
      requireAuth: true
    },
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/feed');

}).constant('API_SERVER', '/BRDR/public/api');
angular.module('brdr.directives', []);
angular.module('brdr.controllers', [])
angular.module('brdr.services', []);
angular.module('brdr.directives')
.directive('fileInput', function($q) {
    let slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function() {};

            element.bind('change', function(e) {
                var element = e.target;

                $q.all(slice.call(element.files, 0).map(readFile))
                    .then(function(values) {
                        if (element.multiple) ngModel.$setViewValue(values);
                        else ngModel.$setViewValue(values.length ? values[0] : null);
                        ngModel.$render();
                    });

                function readFile(file) {
                    var deferred = $q.defer();

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        deferred.resolve(e.target.result);
                    };
                    reader.onerror = function(e) {
                        deferred.reject(e);
                    };
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }

            });

        }
    };
});
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
angular.module('brdr.services')

.service('ComentarioService', [
    '$http',
    'API_SERVER',
    'Auth',
    function($http, API_SERVER, Auth) {

        /**
         * Crear un nuevo comentario.
         *
         */
        this.nuevoComentario = function(comentario) {
            return $http.post(API_SERVER + "/comentario", comentario, {
                headers: { 
                    'x-token': Auth.getToken()
                }
            }).then(
                function(rta){
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
    }
]);
angular.module('brdr.services')

.service('PostsService', [
    '$http',
    'API_SERVER',
    'Auth',
    function($http, API_SERVER, Auth) {

        /**
         * Retorna todos los posts
         *
         */
        this.all = function() {
            return $http.get(API_SERVER + "/").then(
                function(rta){
                    let response = rta.data;
                    if(response.status == 0) {
                        return {
                            data: { message: response.message },
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
        }  

        /**
         * Retorna un post
         *
         */
        this.one = function(id) {
            return $http.get(API_SERVER + "/post/" + id).then(
                function(rta){
                    let response = rta.data;
                    if(response.status == 0) {
                        return {
                            data: { message: response.message },
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
        }              

        /**
         * Crear un post nuevo.
         *
         */
        this.nuevoPost = function(post) {
            return $http.post(API_SERVER + "/post", post, {
                headers: { 
                    'x-token': Auth.getToken()
                }
            }).then(
                function(rta){
                    let response = rta.data;
                    if(response.status == 0) {
                        return {
                            data: { message: response.message },
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
         * Editar un post.
         *
         */
        this.editarPost = function(post) {
            return $http.put(API_SERVER + "/post", post, {
                headers: { 
                    'x-token': Auth.getToken()
                }
            }).then(
                function(rta){
                    let response = rta.data;
                    if(response.status == 0) {
                        return {
                            data: { message: response.message },
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
         * Eliminar un post.
         *
         */
        this.eliminarPost = function(post) {
            return $http.delete(API_SERVER + "/post", post, {
                headers: { 
                    'manija': Auth.getToken()
                }
            }).then(
                function(rta){
                    let response = rta.data;
                    if(response.status == 0) {
                        return {
                            data: { message: response.message },
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
         * Traer posts del usuario
         *
         */
        this.userPosts = function() {
            return $http.get(API_SERVER + "/postsPerfil").then(
                function(rta){
                    let response = rta.data;
                    if(response.status == 0) {
                        return {
                            data: { message: response.message },
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
    }
]);
angular.module('brdr.services')
	.factory('Response', [
		'$ionicPopup',
		'$state',
		function($ionicPopup,$state) {
			return {
				/**
				 * Arma la respuesta de error
				 *
				 * @param {array} data
				 * @param {*} value
				 */
				error: function(data) {

					switch(data.status){

						case -1:
							$ionicPopup.alert({
								template: data.error,
								title: 'Error',
								okText: 'Aceptar'
							});
                            break;

						case 1:
							$state.go('login');
							break;

						case 2:
							$.each(data.error,function(i,e){
                              var name = i;
                              $('*[name="'+i+'"]').addClass('error');
                              $.each(e,function(i,e){
                                $('*[name="'+name+'"]').after('<span class="error">'+e+'</span>');
                              });
                            });
                            break;
					}

					
				},
			}
		}
	]);
angular.module('brdr.services')
.factory('Storage', function() {
	return {
		/**
		 * Agrega un item al Storage.
		 *
		 * @param {string} key
		 * @param {*} value
		 */
		set: function(key, value) {
			localStorage.setItem(key, JSON.stringify(value));
		},
		/**
		 * Obtiene un valor del Storage.
		 *
		 * @param {string} key
		 * @return {*}
		 */
		get: function(key) {
			return JSON.parse(localStorage.getItem(key));
		},
		/**
		 * Verifica si tiene la key en el Storage.
		 *
		 * @param {string} key
		 * @return {boolean}
		 */ 
		has: function(key) {
			return localStorage.getItem(key) !== null;
		},
		/**
		 * Elimina un item del Storage.
		 *
		 * @param {string} key
		 */
		remove: function(key) {
			localStorage.removeItem(key);
		}
	}
});
angular.module('brdr.controllers').controller('ComentarioCtrl',
	[
        '$scope',
        '$stateParams',
        '$state',
        'Storage',
        'Response',
        'API_SERVER',
        'PostsService',
        'ComentarioService',
        function($scope, $stateParams, $state, Storage, Response, API_SERVER, PostsService, ComentarioService) {

            $scope.$on('$ionicView.beforeEnter', function() {

                $scope.imgFolder = API_SERVER + '/images/users/';
                $scope.user = Storage.get('userData');
                $scope.user.imagen = $scope.imgFolder + $scope.user.id;

                PostsService.one($stateParams.id).then(function(rta) {
                    if(rta.data.status != -1){
                        $scope.post = rta.data.message;
                    }
                });
            });
        
            $scope.nuevoComentario = function(comentario) {

                comentario.FK_POST = $scope.post.id;

                $('span.error').remove();
                $('*.error').removeClass('error');

                ComentarioService.nuevoComentario(comentario).then(function(rta) {
                    if (rta.success) {
                        $scope.comentario = [];
                        $state.go('tab.feed');
                    } else {
                        Response.error(rta);
                    }
                });                    
            }

            $scope.eliminarComentario = function(id) {

                ComentarioService.nuevoComentario(id).then(function(rta) {
                    if (rta.success) {
                        $state.go('tab.feed');
                    } else {
                        Response.error(rta);
                    }
                });                    
            }

        }
    ]    
);
angular.module('brdr.controllers').controller('EdicionCtrl',
	[
        '$scope',
        '$stateParams',
        '$state',
        'Storage',
        'Response',
        'API_SERVER',
        'PostsService',
        'ComentarioService',
        function($scope, $stateParams, $state, Storage, Response, API_SERVER, PostsService, ComentarioService) {

            $scope.$on('$ionicView.beforeEnter', function() {
                PostsService.one($stateParams.id).then(function(rta) {
                    if(rta.success){
                        $scope.post = rta.data.message;
                    } else {
                        Response.error(rta);
                    }
                });
            });
        
            $scope.editarPost = function(post) {

                $('span.error').remove();
                $('*.error').removeClass('error');

                PostsService.editarPost(post).then(function(rta) {
                    if (rta.success) {
                        $scope.post = [];
                        $state.go('tab.feed');    
                    } else {
                        Response.error(rta);
                    }
                });                  
            }

            $scope.eliminarPost = function(post) {

                $('span.error').remove();
                $('*.error').removeClass('error');

                PostsService.eliminarPost(post).then(function(rta) {
                    if (rta.success) {
                        $state.go('tab.feed');    
                    } else {
                        Response.error(rta);
                    }
                });                  
            }

        }
    ]    
);
angular.module('brdr.controllers').controller('FeedCtrl',
	[
        '$scope',
        '$state',
        'Storage',
        'Response',
        'PostsService',
        function($scope, $state, Storage, Response, PostsService) {
        	
            $scope.$on('$ionicView.beforeEnter', function() {
                PostsService.all().then(function(rta) {
                    if(rta.success){
                        $scope.posts = rta.data.message;
                    } else {
                        Response.error(rta);
                    }

                });
                $scope.user = Storage.get('userData');
            });
        }
    ]    
);
angular.module('brdr.controllers').controller(
    'LoginCtrl',
    [
        '$scope',
        '$ionicPopup',
        'Response',
        '$state',
        'Auth',
        function($scope, $ionicPopup, Response, $state, Auth) {

            /**
             * Login 
             *
             * @params {user}
             * @returns {array}
             */
            $scope.login = function(user) {

                $('span.error').remove();
                $('*.error').removeClass('error');

                Auth.login(user).then(function(rta) {
                    if (rta.success) {
                        $state.go('tab.feed');    
                    } else {
                        Response.error(rta);
                    }
                });
            }
        }
    ]
);
angular.module('brdr.controllers').controller('NewCtrl',
	[
        '$scope',
        '$state',
        'Response',
        'PostsService',
        function($scope, $state, Response, PostsService) {

        	$scope.post = {
				texto: null,
				imagen: 'images/imageLoader.jpg',
			};

			$scope.post.imagen = function() {
			    if(!navigator.camera) {
			  		return 'images/imageLoader.jpg';      
			    }

			    var options = {
			        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
			        destinationType: navigator.camera.DestinationType.DATA_URL,
			        encodingType: navigator.camera.EncodingType.JPEG,
			        targetWidth: 500
			    };

			    navigator.camera.getPicture(
			        function (imageData) {
			            $scope.imagenPreview = "data:image/jpeg;base64," + imageData;
			            $scope.producto.imagen = imageData;
			        },

			        function(error) {
			            console.log("Error! ", error);
			        },
			        options
			    );
			};


			/**
			 * Creacion de nuevo post
			 *
			 * @params {post}
			 * @returns {array}
			 */
			$scope.nuevoPost = function(post) {

                $('span.error').remove();
				$('*.error').removeClass('error');

			    PostsService.nuevoPost(post).then(function(rta) {
			    	if (rta.success) {
			    		$scope.post = [];
			    	    $state.go('tab.feed');    
			    	} else {
			    	    Response.error(rta);
			    	}
			    });                    
			}

        }
    ]    
);
angular.module('brdr.controllers').controller('ProfileCtrl',
    [
        '$scope',
        '$state',
        'Auth',
        'Storage',
        'Response',
        'API_SERVER',
        function($scope, $state, Auth, Storage, Response, API_SERVER) {

            $scope.user = [];

            $scope.$on('$ionicView.beforeEnter', function() {
                misDatos();
            });

            /**
             * Trae los posts de la api
             *
             * @returns {array}
             */
            function misDatos() {
                $scope.user = Storage.get('userData');
                $scope.user.imagen = API_SERVER + '/images/users/' + $scope.user.id + '.jpg';
            }

            $scope.update = function(user){

                $('span.error').remove();
                $('*.error').removeClass('error');

                if(!$scope.user.imagen.includes("image/")){
                  // Si la imagen no es base64, no fue actualizada
                  $scope.user.imagen = '';
                }

                Auth.update(user).then(function(rta) {
                  if (rta.success) {
                      $state.go('tab.feed');
                  } else {
                      Response.error(rta);
                  }
                });
            }
            
            /**
             * Logout
             *
             * @params {user}
             * @returns {array}
             */
            $scope.logout = function(user) {
                Auth.logout(user);
                $state.go('login');
            }
        }
    ]    
);
angular.module('brdr.controllers').controller(
    'RegistroCtrl',
    [
        '$scope',
        '$ionicPopup',
        '$state',
        'Auth',
        'Response',
        function($scope, $ionicPopup, $state, Auth, Response) {

            /**
             * Registro de usuarios
             *
             * @param {user} 
             * @returns {array}
             */
            $scope.registro = function(user) {

                $('span.error').remove();
                $('*.error').removeClass('error');

                Auth.registro(user).then(function(rta) {
                  if (rta.success) {
                      $state.go('login');    
                  } else {
                    Response.error(rta);
                  }
                });
            }
        }
    ]
);
//# sourceMappingURL=../maps/bundle.js.map
