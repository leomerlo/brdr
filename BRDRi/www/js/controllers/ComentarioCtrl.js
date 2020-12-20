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