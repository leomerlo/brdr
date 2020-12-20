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