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