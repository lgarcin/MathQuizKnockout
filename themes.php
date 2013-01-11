<?php
function getValue($el) {
	return $el['value'];
}

$xml = simplexml_load_file('Exercices/qcm.xsd');
$themes = $xml -> xpath('//xs:element[@name="theme"]/xs:simpleType/xs:restriction/xs:enumeration');
echo json_encode(array_map('getValue', $themes));
?>