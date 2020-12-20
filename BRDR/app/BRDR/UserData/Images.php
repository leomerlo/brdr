<?php
namespace BRDR\UserData;

use BRDR\Core\APP;
use Exception;

class Images
{

	/**
	 * Sube la imagen
	 * 
	 * @param string $name
	 * @param string $imageName
	 * @param string $path
	 * @throws Exception
	 *
	 * @return bool
	 */
	public static function upload($imagen,$imageName,$type = 'post')
	{

		if(!empty($imagen)) {

			$imageBase64 = str_replace('data:image/jpeg;base64,', '', $imagen);
			$imageBase64Decoded = base64_decode($imageBase64);
			$imageSource = imagecreatefromstring($imageBase64Decoded);
			$imagen = $imageName . ".jpg";

			$route = ($type == 'user') ? App::$userImagesPath . $imagen : App::$postImagesPath . $imagen;

			if(imagejpeg($imageSource, $route)){
				return true;
			} else {
				throw new Exception("No se pudo subir la imagen");
			}
			
		} else {
			return false;
		}

	}

	/**
	 * Trae la imagen
	 * 
	 * @param string $name
	 * @param string $path
	 * @param string $imageName
	 *
	 * @return bool
	 */
	public static function get($id)
	{
		//return move_uploaded_file($_FILES[$name]['tmp_name'],sprintf($path . '%s.%s',$imageName,"jpg"));
		return "TO DO";
	}
}