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
        '$ionicLoading',
        function($scope, $state, $stateParams, Auth, PerfilService, Storage, Response, API_SERVER, IMAGE_FOLDER, $ionicLoading) {

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

                $ionicLoading.show({
                    template: 'Cargando...',
                })

                Auth.update(user).then(function(rta) {
                  if (rta.success) {
                    Storage.set('userData',user);
                    $scope.user = user;
                    $state.go('tab.feed',{},{ reload: true, inherit: false, notify: true });
                  } else {
                      Response.error(rta);
                  }

                  $ionicLoading.hide();

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