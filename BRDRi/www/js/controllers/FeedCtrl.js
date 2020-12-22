angular.module('brdr.controllers').controller('FeedCtrl',
	[
        '$scope',
        '$state',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        'PostsService',
        '$ionicLoading',
        function($scope, $state, Storage, Response, API_SERVER, IMAGE_FOLDER, PostsService, $ionicLoading) {
        	
            $scope.$on('$ionicView.beforeEnter', function() {

                $scope.nuance = new Date().getTime();
                $scope.imgFolder = IMAGE_FOLDER;

                $ionicLoading.show({
                    template: 'Cargando...',
                })

                PostsService.all().then(function(rta) {
                    if(rta.success){
                        $scope.posts = rta.data.message;
                    } else {
                        Response.error(rta);
                    }

                    $ionicLoading.hide();

                });
                $scope.user = Storage.get('userData');
            });
        }
    ]    
);