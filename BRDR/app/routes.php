<?php
/*
Acá vamos a definir todas nuestras rutas de la aplicación. TODAS 
TODITAS.
*/

use BRDR\Core\Route;

Route::add('GET', 	'/', 				'PostController@index');

Route::add('POST', 	'/login', 			'AuthController@login');
Route::add('POST', 	'/registro', 		'UserController@agregar');

Route::add('POST', 	'/post', 			'PostController@agregar');
Route::add('GET', 	'/post/{id}', 		'PostController@ver');
Route::add('PUT', 	'/post/{id}', 		'PostController@editar');
Route::add('DELETE','/post/{id}', 		'PostController@eliminar');

Route::add('GET', 	'/perfil', 			'UserController@perfil');
Route::add('PUT', 	'/perfil',		 	'UserController@editar');
Route::add('GET', 	'/perfil/{id}', 	'UserController@perfil');
Route::add('DELETE','/perfil/{id}', 	'UserController@eliminar');

// Route::add('GET', 	'/fav', 			'FavoritoController@get');
// Route::add('GET', 	'/fav/{user_id}', 	'FavoritoController@get');
// Route::add('POST', 	'/fav/{post_id}', 	'FavoritoController@agregar');
// Route::add('DELETE','/fav/{post_id}', 	'FavoritoController@eliminar');

Route::add('GET', 	'/mensajes', 			'MensajeController@conversaciones');
Route::add('GET', 	'/mensajes/{user_id}', 	'MensajeController@ver');
Route::add('POST', 	'/mensajes/{user_id}', 	'MensajeController@enviar');

Route::add('GET', 	'/amigos', 				'AmigoController@listar');
Route::add('GET', 	'/amigos/feed', 		'AmigoController@feed');
Route::add('GET', 	'/amigos/{user_id}', 	'AmigoController@exists');
Route::add('POST', 	'/amigos/{user_id}', 	'AmigoController@agregar');
Route::add('DELETE','/amigos/{user_id}', 	'AmigoController@eliminar');

Route::add('POST', 	'/comentario/{id}', 'ComentarioController@agregar');
Route::add('PUT', 	'/comentario/{id}', 'ComentarioController@editar');
Route::add('DELETE','/comentario/{id}', 'ComentarioController@eliminar');