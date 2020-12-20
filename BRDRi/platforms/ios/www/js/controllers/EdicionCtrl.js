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