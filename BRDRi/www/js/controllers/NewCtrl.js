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