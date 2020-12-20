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