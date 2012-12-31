<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<?php 
	$google_key = '';
	$host = $_SERVER['HTTP_HOST'];
	if ($host == 'mmclar.dyndns.org'){
		$google_key = 'ABQIAAAAWkLoRyKMiEp-MzJSV6esWBT5w9XzsCNVR7bANPBewbwuhytdzRTbHQMYHV4jKNuPT69lZgyvPchayw';
	}
	else{
		$google_key = 'ABQIAAAAWkLoRyKMiEp-MzJSV6esWBT5w9XzsCNVR7bANPBewbwuhytdzRTbHQMYHV4jKNuPT69lZgyvPchayw';
	}
?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Picture Locator</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
	<script src="http://maps.google.com/maps?file=api&v=2&key=<?php echo $google_key; ?>&sensor=false" type="text/javascript"></script>
  <script src="http://www.google.com/jsapi?key=<?php echo $google_key; ?>"></script>
  <script src="math.js"></script>
  <script src="ploc.js"></script>
  </head>
  <body onload="init();" style="font-family: arial, sans-serif; font-size: 13px; border: 0;">
  	<div id="map3d" style="width: 500px; float: left;"></div>
		<script>$('#map3d').height($(window).height() - 16);</script>
		<table class="points" border="solid 1px">
			<tr><td></td><td>Lon</td><td>Lat</td><td>Alt</td></tr>
			<tr class="P1">
				<td><input type="radio" name="points" value="P1" checked="true">P1</option></td>
				<td class="lon">-75.17955792696408</td>
				<td class="lat">39.95270058292888</td>
				<td class="alt">100.45298693382182</td>
			</tr>
			<tr class="P2">
				<td><input type="radio" name="points" value="P2">P2</option></td>
				<td class="lon">-75.17489529235564</td>
				<td class="lat">39.95421966597523</td>
				<td class="alt">110.456496509922</td>
			</tr>
			<tr class="P3">
				<td><input type="radio" name="points" value="P3">P3</option></td>
				<td class="lon">-75.17125624810063</td>
				<td class="lat">39.95316260513156</td>
				<td class="alt">147.87268176077114</td>
			</tr>
			<tr class="P4">
				<td><input type="radio" name="points" value="P4">P4</option></td>
				<td class="lon">-75.16980825610847</td>
				<td class="lat">39.953515587527676</td>
				<td class="alt">169.46170459888305</td>
			</tr>
		</table>
		<button class="locate">Locate</button>
  </body>
 </html>
