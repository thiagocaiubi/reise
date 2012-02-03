var request = require('request'), 
	xml2js = require('xml2js');

var ECOVIVAS_BASE_URL = 'http://ecovias.com.br/Content/Cameras/',
	CAMERAS_FROM_DEPARTURE_TO_ARRIVAL = [1,2,3,4,5,6,7,8,13,15];

exports.index = function(req, res){
	
	var parser = new xml2js.Parser();
		
	request('http://ecovias.com.br/Xml/Cameras.ashx?v=46', function (error, response, body) {
		parser.parseString(body, function (err, result) {
			var cameras = []; 
			
			result.camera.forEach(function(item){
				var camera = item['@'];
				if (isCameraInRoute(camera)) {
					cameras.push({
						image: camera.img,
						location: camera.trecho
					});
				}
			});
			res.render('index', { title: 'Reise', baseUrl: ECOVIVAS_BASE_URL, cameras: cameras })	
    	});
	});
	
	function isCameraInRoute(camera) {
		return CAMERAS_FROM_DEPARTURE_TO_ARRIVAL.indexOf(parseInt(camera.id)) != -1;
	}
};