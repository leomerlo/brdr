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