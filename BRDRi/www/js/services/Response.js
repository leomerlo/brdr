angular.module('brdr.services')
	.factory('Response', [
		'$ionicPopup',
		'$state',
		function($ionicPopup,$state) {
			return {
				/**
				 * Arma la respuesta de error
				 *
				 * @param {array} data
				 * @param {*} value
				 */
				error: function(data) {

					switch(data.status){

						case -1:
							$ionicPopup.alert({
								template: data.error,
								title: 'Error',
								okText: 'Aceptar'
							});
                            break;

						case 1:
							$state.go('login');
							break;

						case 2:
							$.each(data.error,function(i,e){
                              var name = i;
                              $('*[name="'+i+'"]').addClass('error');
                              $.each(e,function(i,e){
                                $('*[name="'+name+'"]').after('<span class="error">'+e+'</span>');
                              });
                            });
                            break;
					}

					
				},
			}
		}
	]);