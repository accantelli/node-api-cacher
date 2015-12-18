function toast(msg, type) {
	
	var options = {
		"closeButton" : true,
		"progressBar" : true,
		"newestOnTop" :true
 	}

 	var types = ["success", "info", "warning", "error"];
	if (!type || types.indexOf(type)==-1 ) {
		type="info";
	}
	
	toastr[type](msg, options);
}


function date2Timestamp(dateObj) {
	if (dateObj != undefined) {
		return dateObj.getTime();
	}
	return new new Date().getTime();
}

function timestamp2Date(ts) {
	var d = new Date(ts);
	return d.toGMTString();
}

function getParameters(str) {
	var matches = [];
	var pattern = new RegExp(/{\w+}/g);
	while (match = pattern.exec(str)) {
		var x = match[0];
		x = x.replace("{", "");
		x = x.replace("}", "");
    	matches.push(x);
    }
    return matches;
}
