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