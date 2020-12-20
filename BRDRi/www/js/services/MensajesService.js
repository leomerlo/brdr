angular.module('brdr.services')

.service('MensajesService', [
    '$http',
    'API_SERVER',
    'Auth',
    function($http, API_SERVER, Auth) {

        /**
         * Retorna todas las conversaciones
         *
         */
        this.conversaciones = function() {
            return $http.get(API_SERVER + "/mensajes", {
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
        }  

        /**
         * Retorna una conversacion
         *
         */
        this.getHilo = function(id) {
            return $http.get(API_SERVER + "/mensajes/" + id, {
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
        }              

        /**
         * Enviar un mensaje
         *
         */
        this.enviar = function(id,post) {
            return $http.post(API_SERVER + "/mensajes/" + id, post, {
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