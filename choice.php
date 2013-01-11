<?php
$xmlin = simplexml_load_file('Exercices/qcm.xml');
switch ($_GET['niveau']) {
	case "Première année" :
		$select = $xmlin -> xpath('//exo[niveau="Première année"]');
		break;
	case "Deuxième année" :
		$select = $xmlin -> xpath('//exo[niveau="Deuxième année"]');
		break;
	default :
		$select = $xmlin -> xpath('//exo');
		break;
}
shuffle($select);
$xmlout = <<<XML
<?xml version="1.0" encoding="utf-8"?>
XML;
$xmlout .= '<qcm>';
for ($i = 0; $i < $_GET['number']; $i++) {
	$xmlout .= $select[$i] -> asXML();
}
$xmlout .= '</qcm>';
echo $xmlout;
?>