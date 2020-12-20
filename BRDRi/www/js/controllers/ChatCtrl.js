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