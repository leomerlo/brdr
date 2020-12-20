<?php

namespace BRDR\Security;

require 'Vendor/autoload.php';

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Signer\Hmac\Sha256;

class Token
{

	protected $key = "hjknuavsñjktnvyuhaljsbcsiurhbs";
	protected $issuer = "http://brdr.com.ar";

	/**
	 * Encripta el password usando un algoritmo irreversible y seguro.
	 *
	 * @param string $password
	 * @return string
	 */
	public function create($id)
	{
		$alg = new Sha256();

		$builder = new Builder;
		$builder->setIssuer($this->getIssuer());
		$builder->setIssuedAt(time());
		$builder->set('id', $id);

		$builder->sign($alg, $this->getKey());
		$token = $builder->getToken();

		return (string) $token;
	}

	public function validate($token){
		try {
			$parser = new Parser;
			$token = $parser->parse($token);

			// Definimos los criterios de validación del token.
			$validationData = new ValidationData;
			$validationData->setIssuer($this->getIssuer());

			if(!$token->validate($validationData)) {
				throw new Exception("Token inválido.");
			}

			// Verificamos la firma del token, para saber que no fue adulterado.
			$alg = new Sha256;

			if(!$token->verify($alg, $this->getKey())) {
				throw new Exception("Token inválido.");
			}

			return [
				'id' => $token->getClaim('id')
			];
		} catch(\Exception $e) {
			return false;
		}
	}


	private function getKey(){

		return $this->key;

	}

	private function getIssuer(){

		return $this->issuer;

	}
}