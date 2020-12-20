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
        this.nuevoComentario = function(id,comentario) {
            return $http.post(API_SERVER + "/comentario/" + id, comentario, {
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

        /**
         * Crear un nuevo comentario.
         *
         */
        this.eliminarComentario = function(id) {
            return $http.delete(API_SERVER + "/comentario/" + id, {
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