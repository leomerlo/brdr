angular.module('brdr.controllers').controller(
    'LoginCtrl',
    [
        '$scope',
        '$ionicPopup',
        'Response',
        '$state',
        'Auth',
        function($scope, $ionicPopup, Response, $state, Auth) {

            /**
             * Login 
             *
             * @params {user}
             * @returns {array}
             */
            $scope.login = function(user) {

                $('span.error').remove();
                $('*.error').removeClass('error');

                Auth.login(user).then(function(rta) {
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