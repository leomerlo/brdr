angular.module('brdr.services')

.service('PostsService', [
    '$http',
    'API_SERVER',
    'Auth',
    function($http, API_SERVER, Auth) {

        /**
         * Retorna todos los posts
         *
         */
        this.all = function() {
            return $http.get(API_SERVER + "/").then(
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
         * Retorna lost posts de mis amigos
         *
         */
        this.amigos = function() {
            return $http.get(API_SERVER + "/amigos/feed", {
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
         * Retorna un post
         *
         */
        this.one = function(id) {
            return $http.get(API_SERVER + "/post/" + id).then(
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
         * Crear un post nuevo.
         *
         */
        this.nuevoPost = function(post) {
            return $http.post(API_SERVER + "/post", post, {
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
         * Editar un post.
         *
         */
        this.editarPost = function(id,post) {
            return $http.put(API_SERVER + "/post/" + id, post, {
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
         * Eliminar un post.
         *
         */
        this.eliminarPost = function(id,post) {
            return $http.delete(API_SERVER + "/post/" + id, {
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
         * Traer posts del usuario
         *
         */
        this.userPosts = function() {
            return $http.get(API_SERVER + "/postsPerfil").then(
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