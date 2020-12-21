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
  })

  .state('tab.feedamigos', {
    url: '/feedamigos',
    data: {
      requireAuth: true
    },
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-feed.html',
        controller: 'FeedAmigosCtrl'
      }
    }
  })

  .state('tab.user', {
    url: '/user/:id',
    data: {
      requireAuth: true
    },
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'UserCtrl'
      }
    }
  })

  .state('tab.fav', {
    url: '/fav',
    data: {
      requireAuth: true
    },
    views: {
      'tab-fav': {
        templateUrl: 'templates/tab-fav.html',
        controller: 'FavCtrl'
      }
    }
  })

  .state('tab.mensajes', {
    url: '/mensajes',
    data: {
      requireAuth: true
    },
    views: {
      'tab-mensajes': {
        templateUrl: 'templates/tab-mensajes.html',
        controller: 'MensajesCtrl'
      }
    }
  })

    .state('tab.amigos', {
      url: '/amigos',
      data: {
        requireAuth: true
      },
      views: {
        'tab-mensajes': {
          templateUrl: 'templates/tab-amigos.html',
          controller: 'AmigosCtrl'
        }
      }
    })

    .state('tab.chat', {
      url: '/mensajes/:id',
      data: {
        requireAuth: true
      },
      views: {
        'tab-mensajes': {
          templateUrl: 'templates/tab-chat.html',
          controller: 'ChatCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/feed');

}).constant('API_SERVER', '/_brdr/brdr/BRDR/public/api')
.constant('IMAGE_FOLDER', '/_brdr/brdr/BRDR/public/images/');
angular.module('brdr.directives', []);
angular.module('brdr.controllers', [])
angular.module('brdr.services', []);
angular.module('brdr.controllers').controller('AmigosCtrl',
    [
        '$scope',
        '$state',
        'Auth',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        'PerfilService',
        function($scope, $state, Auth, Storage, Response, API_SERVER, IMAGE_FOLDER,PerfilService) {

            $scope.$on('$ionicView.beforeEnter', function() {

                $scope.nuance = new Date().getTime();
                $scope.imgFolder = IMAGE_FOLDER + 'users';

                PerfilService.amigos().then(function(rta) {
                    if(rta.success){
                        $scope.amigos = rta.data.message;
                    } else {
                        Response.error(rta);
                    }
                });

            });

        }
    ]    
);
angular.module('brdr.controllers').controller('ChatCtrl',
    [
        '$scope',
        '$state',
        '$stateParams',
        'Auth',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        'MensajesService',
        function($scope, $state, $stateParams, Auth, Storage, Response, API_SERVER, IMAGE_FOLDER,MensajesService) {

            $scope.$on('$ionicView.beforeEnter', function() {

                $scope.imgFolder = IMAGE_FOLDER + 'users';
                $scope.user = Storage.get('userData');
                $scope.titulo = '';

                $scope.getMensajes();

            });

            $scope.$on('$ionicView.beforeLeave', function() {
                clearInterval(loop);
            });

            var loop = setInterval(function(){
                $scope.getMensajes();                
            },5000);

            $scope.getMensajes = function(){
                MensajesService.getHilo($stateParams.id).then(function(rta) {
                    if(rta.success){
                        $scope.mensajes = rta.data.message;
                        for(i in $scope.mensajes){
                            if($scope.mensajes[i]['emisor']['id'] == $scope.user.id){
                                $scope.mensajes[i]['arrowClass'] = 'arrow-right';
                                $scope.titulo = $scope.mensajes[i]['receptor']['usuario'];
                            } else {
                                $scope.mensajes[i]['arrowClass'] = 'arrow-left';
                                $scope.titulo = $scope.mensajes[i]['emisor']['usuario'];
                            }
                        }
                    } else {
                        Response.error(rta);
                    }
                });
            }

            $scope.enviarMensaje = function(mensaje){

                var data = {
                    'mensaje': mensaje
                }

                MensajesService.enviar($stateParams.id,data).then(function(rta){
                    if(rta.success){
                        $scope.nuevoMensaje = '';
                        $scope.getMensajes();
                    } else {
                        Response.error(rta);
                    }
                });

            }

        }
    ]    
);
angular.module('brdr.controllers').controller('ComentarioCtrl',
	[
        '$scope',
        '$stateParams',
        '$state',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        'PostsService',
        'ComentarioService',
        function($scope, $stateParams, $state, Storage, Response, API_SERVER, IMAGE_FOLDER, PostsService, ComentarioService) {

            $scope.$on('$ionicView.beforeEnter', function() {

                $scope.comentario = {
                    texto: ""
                };
                $scope.imgFolder = IMAGE_FOLDER + 'users/';
                $scope.user = Storage.get('userData');
                $scope.user.imagen = $scope.imgFolder + $scope.user.id;
                $scope.nuance = new Date().getTime();

                PostsService.one($stateParams.id).then(function(rta) {
                    if(rta.data.status != -1){
                        $scope.post = rta.data.message;
                    }
                });
            });
        
            $scope.nuevoComentario = function() {

                //$scope.comentario = $scope.post.id;

                console.log($scope.comentario);

                $('span.error').remove();
                $('*.error').removeClass('error');

                ComentarioService.nuevoComentario($scope.post.id,$scope.comentario).then(function(rta) {
                    if (rta.success) {
                        $scope.comentario = {
                            texto: ""
                        };
                        $state.go('tab.feed');
                    } else {
                        Response.error(rta);
                    }
                });                    
            }

            $scope.eliminarComentario = function(id) {

                ComentarioService.eliminarComentario(id).then(function(rta) {
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

                PostsService.editarPost($stateParams.id,post).then(function(rta) {
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

                PostsService.eliminarPost($stateParams.id,post).then(function(rta) {
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
angular.module('brdr.controllers').controller('FavCtrl',
    [
        '$scope',
        '$state',
        'Auth',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        function($scope, $state, Auth, Storage, Response, API_SERVER, IMAGE_FOLDER) {
        }
    ]    
);
angular.module('brdr.controllers').controller('FeedAmigosCtrl',
	[
        '$scope',
        '$state',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        'PostsService',
        function($scope, $state, Storage, Response, API_SERVER, IMAGE_FOLDER, PostsService) {
        	
            $scope.$on('$ionicView.beforeEnter', function() {

                $scope.imgFolder = IMAGE_FOLDER;

                PostsService.amigos().then(function(rta) {
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
angular.module('brdr.controllers').controller('FeedCtrl',
	[
        '$scope',
        '$state',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        'PostsService',
        function($scope, $state, Storage, Response, API_SERVER, IMAGE_FOLDER, PostsService) {
        	
            $scope.$on('$ionicView.beforeEnter', function() {

                $scope.nuance = new Date().getTime();
                $scope.imgFolder = IMAGE_FOLDER;

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
angular.module('brdr.controllers').controller('MensajesCtrl',
    [
        '$scope',
        '$state',
        'Auth',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        'MensajesService',
        function($scope, $state, Auth, Storage, Response, API_SERVER, IMAGE_FOLDER,MensajesService) {

            $scope.$on('$ionicView.beforeEnter', function() {

                $scope.nuance = new Date().getTime();
                $scope.imgFolder = IMAGE_FOLDER + 'users';
                $scope.user = Storage.get('userData');

                MensajesService.conversaciones().then(function(rta) {
                    if(rta.success){
                        $scope.conversaciones = rta.data.message;
                        for(i in $scope.conversaciones){

                            if($scope.conversaciones[i]['emisor']['id'] == $scope.user.id){
                                $scope.conversaciones[i]['conv_id'] = $scope.conversaciones[i]['receptor']['id'];
                                $scope.conversaciones[i]['nombre'] = $scope.conversaciones[i]['receptor']['usuario'];
                            } else {
                                $scope.conversaciones[i]['conv_id'] = $scope.conversaciones[i]['emisor']['id'];
                                $scope.conversaciones[i]['nombre'] = $scope.conversaciones[i]['emisor']['usuario'];
                            }
                        }
                    } else {
                        Response.error(rta);
                    }
                });

            });

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

        	$scope.$on('$ionicView.beforeEnter', function() {
                $scope.post = {
					texto: null,
					imagen: 'images/imageLoader.jpg',
				};
            });


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
        '$stateParams',
        'Auth',
        'PerfilService',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        function($scope, $state, $stateParams, Auth, PerfilService, Storage, Response, API_SERVER, IMAGE_FOLDER) {

            $scope.user = [];

            $scope.$on('$ionicView.beforeEnter', function() {
              $scope.title = "Mi cuenta";
              $scope.disable = false;
              $scope.user = Storage.get('userData');
              $scope.user.imagen = IMAGE_FOLDER + '/users/' + $scope.user.id + '.jpg?req=' + new Date().getTime();;
            });

            $scope.update = function(user){

                $('span.error').remove();
                $('*.error').removeClass('error');

                if(!$scope.user.imagen.includes("image/")){
                  // Si la imagen no es base64, no fue actualizada
                  $scope.user.imagen = '';
                }

                Auth.update(user).then(function(rta) {
                  if (rta.success) {
                      $state.go('tab.feed',{},{ reload: true, inherit: false, notify: true });
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
angular.module('brdr.controllers').controller('UserCtrl',
    [
        '$scope',
        '$state',
        '$stateParams',
        'PerfilService',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        '$ionicPopup',
        function($scope, $state, $stateParams, PerfilService, Response, API_SERVER, IMAGE_FOLDER, $ionicPopup) {

            $scope.user = [];

            $scope.$on('$ionicView.beforeEnter', function() {
              $scope.disable = true;

              PerfilService.getUserInfo($stateParams.id).then(function(rta) {
                if(rta.success){
                    $scope.user = rta.data.message;
                    $scope.user.imagen = IMAGE_FOLDER + 'users/' + $scope.user.id + '.jpg';
                    $scope.title = $scope.user.usuario;
                } else {
                    Response.error(rta);
                }
              });

            });

            $scope.agregarAmigo = function(){
              PerfilService.agregarAmigo($stateParams.id).then(function(rta) {
                if (rta.success) {
                    $state.go('tab.amigos');
                } else {
                    Response.error(rta);
                }
              });
            }

            $scope.eliminarAmigo = function(){
              PerfilService.eliminarAmigo($stateParams.id).then(function(rta) {
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

		/**
		 * Trae info del usuario pedido
		 *
		 * @param {{}} user
		 * @return {Promise}
		 */
		let getUserInfo = function(id) {
			return $http.get(API_SERVER + "/perfil/" + id, {
                    headers: { 
                        'x-token': Auth.getToken()
                    }
                }).then(
				function(rta) {
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
        this.nuevoComentario = function(id,comentario) {
            return $http.post(API_SERVER + "/comentario/" + id, comentario, {
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

        /**
         * Crear un nuevo comentario.
         *
         */
        this.eliminarComentario = function(id) {
            return $http.delete(API_SERVER + "/comentario/" + id, {
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

.service('MensajesService', [
    '$http',
    'API_SERVER',
    'Auth',
    function($http, API_SERVER, Auth) {

        /**
         * Retorna todas las conversaciones
         *
         */
        this.conversaciones = function() {
            return $http.get(API_SERVER + "/mensajes", {
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
        }  

        /**
         * Retorna una conversacion
         *
         */
        this.getHilo = function(id) {
            return $http.get(API_SERVER + "/mensajes/" + id, {
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
        }              

        /**
         * Enviar un mensaje
         *
         */
        this.enviar = function(id,post) {
            return $http.post(API_SERVER + "/mensajes/" + id, post, {
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
    }
]);
angular.module('brdr.services')

.service('PerfilService', [
    '$http',
    'API_SERVER',
    'Auth',
    function($http, API_SERVER, Auth) {

        /**
         * Devuelve la info de un usuario
         *
         */
        this.getUserInfo = function(id) {
            return $http.get(API_SERVER + "/perfil/" + id, {
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
         * Agrega un usuario a la lista de amigos
         *
         */
        this.amigos = function(id) {

            var data = [];

            return $http.get(API_SERVER + "/amigos", {
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
         * Agrega un usuario a la lista de amigos
         *
         */
        this.agregarAmigo = function(id) {

            var data = [];

            return $http.post(API_SERVER + "/amigos/" + id, data, {
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
         * Elimina un usuario de la lista de amigos
         *
         */
        this.eliminarAmigo = function(id) {

            var data = [];

            return $http.delete(API_SERVER + "/amigos/" + id, {
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
         * Retorna lost posts de mis amigos
         *
         */
        this.amigos = function() {
            return $http.get(API_SERVER + "/amigos/feed", {
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
        this.editarPost = function(id,post) {
            return $http.put(API_SERVER + "/post/" + id, post, {
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
        this.eliminarPost = function(id,post) {
            return $http.delete(API_SERVER + "/post/" + id, {
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
//# sourceMappingURL=../maps/bundle.js.map
