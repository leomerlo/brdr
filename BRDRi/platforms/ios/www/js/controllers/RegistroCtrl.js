angular.module('brdr.controllers').controller(
    'RegistroCtrl',
    [
        '$scope',
        '$ionicPopup',
        '$state',
        'Auth',
        'Response',
        function($scope, $ionicPopup, $state, Auth, Response) {

            /**
             * Registro de usuarios
             *
             * @param {user} 
             * @returns {array}
             */
            $scope.registro = function(user) {

                $('span.error').remove();
                $('*.error').removeClass('error');

                Auth.registro(user).then(function(rta) {
                  if (rta.success) {
                      $state.go('login');    
                  } else {
                    Response.error(rta);
                  }
                });
            }
        }
    ]
);