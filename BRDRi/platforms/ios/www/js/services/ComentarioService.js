angular.module('brdr.services')

.service('ComentarioService', [
    '$http',
    'API_SERVER',
    'Auth',
    function($http, API_SERVER, Auth) {

        /**
         * Crear un nuevo comentario.
         *
         */
        this.nuevoComentario = function(comentario) {
            return $http.post(API_SERVER + "/comentario", comentario, {
                headers: { 
                    'x-token': Auth.getToken()
                }
            }).then(
                function(rta){
                    let response = rta.data;
                    if(response.status == 0) {
                        return {
                            success: true
                        };
                    } else {
                        return {
                            success: false,
                            status: response.status,
                            error: response.message
                        };
                    }
                }
            );
        };
    }
]);