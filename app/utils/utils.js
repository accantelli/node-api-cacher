var HTTP_200 = 200;
var HTTP_400 = 400;
var HTTP_404 = 404;
var HTTP_500 = 500;

exports.generateHash = function generateHash(str, arr) {
	
	if (arr!=null && arr.length>0) {
		str += "|" + this.replaceAll(
			arr.sort().toString(), ',', '|');
	}

	return str;
}

exports.replaceAll = function replaceAll(str, find, replace) {
  return str.replace(
  		new RegExp(find, 'g'), replace);
}

exports.contains = function contains(str, find) {
	return (str!=null && find!=null 
				&& str.indexOf(find) > -1);
}

exports.isValidUrl = function isValidUrl(str) {
	return (str!=null
				&& str.indexOf(find) > -1);
}

exports.timestamp2date = function timestamp2date(ts) {
	return (new Date(ts).toGMTString());
}

exports.date2timestamp = function timestamp2date(dateObj) {
	if (dateObj != undefined) {
		return dateObj.getTime();
	}
	return new new Date().getTime();
}

exports.getFormatDate = function getFormatDate() {
	var d = new Date();
	return d.toISOString();
}