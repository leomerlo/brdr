angular.module('brdr.services')

.service('PerfilService', [
    '$http',
    'API_SERVER',
    'Auth',
    function($http, API_SERVER, Auth) {

        /**
         * Devuelve la info de un usuario
         *
         */
        this.getUserInfo = function(id) {
            return $http.get(API_SERVER + "/perfil/" + id, {
                    headers: { 
                        'x-token': Auth.getToken()
                    }
                }).then(
                function(rta){
                    let response = rta.data;

                    if(response.status == 0) {
                        return {
                            data: { message: response.message },
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
         * Agrega un usuario a la lista de amigos
         *
         */
        this.amigos = function(id) {

            var data = [];

            return $http.get(API_SERVER + "/amigos", {
                    headers: { 
                        'x-token': Auth.getToken()
                    }
                }).then(
                function(rta){
                    let response = rta.data;

                    if(response.status == 0) {
                        return {
                            data: { message: response.message },
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
         * Agrega un usuario a la lista de amigos
         *
         */
        this.agregarAmigo = function(id) {

            var data = [];

            return $http.post(API_SERVER + "/amigos/" + id, data, {
                    headers: { 
                        'x-token': Auth.getToken()
                    }
                }).then(
                function(rta){
                    let response = rta.data;

                    if(response.status == 0) {
                        return {
                            data: { message: response.message },
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
         * Elimina un usuario de la lista de amigos
         *
         */
        this.eliminarAmigo = function(id) {

            var data = [];

            return $http.delete(API_SERVER + "/amigos/" + id, {
                    headers: { 
                        'x-token': Auth.getToken()
                    }
                }).then(
                function(rta){
                    let response = rta.data;

                    if(response.status == 0) {
                        return {
                            data: { message: response.message },
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