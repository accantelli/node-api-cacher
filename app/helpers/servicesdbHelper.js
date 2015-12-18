/***

  Services database.

  Object model definition:
  {
    _id : (internal),
    key : (string),
    type : http|???,
    value : (url string),
    resultType : auto|json|xml|html|plain,
    ttl : (cache time-to-live in seconds)
  }
  
  **/

function buildBasicObject(key, value, ttl) {
  return buildBasicObject(key, "http", value, "auto", ttl);
}

function buildObject(key, type, value, resultType, ttl) {

  var obj = {
    key        : key,
    type       : type || "http",
    value      : value,
    resultType : resultType || "auto",
    ttl        : ttl || 500
  }

  return obj;
}

exports.validation = function validation(obj) {
  return true;
}

exports.selectAll = function selectAll(callback) {

  App.servicesdb.find({}).sort({ key: 1 }).exec(function(err, result) {
      if (err) {
          callback(err, result);
      } 
      else {
          callback(null, result)
      }
    });

}

exports.selectById = function selectById(id, callback) {

  App.servicesdb.find({_id:id}, function(err, result) {
      if (err) {
          callback(err, result);
      } 
      else {
          callback(null, result)
      }
    });

}

exports.selectByKey = function selectByKey(key, callback) {

  App.servicesdb.find({key:key}, function(err, result) {
      if (err) {
          callback(err, result);
      } 
      else {
          callback(null, result)
      }
    });

}

exports.insert = function insert(data, callback) {

  var obj = buildObject(data.key, data.type, data.value, data.resultType, data.ttl);

  this.selectByKey(obj.key, function(err, result) {

    if (err) {
      callback(err);
    }
    else if (result.length>0) {
      msg = "Error: Cannot insert duplicate value, key=" + obj.key;
      console.log(msg);
      callback(new Error(msg));
    }
    else {

      App.servicesdb.insert( obj , function(err, newObj) {
        if (err) {
            callback(err, newObj);
        } 
        else {
            callback(null, newObj);
        }
      });

    }

  });
}

exports.update = function updateById(id, data, callback) {

  var obj = buildObject(data.key, data.type, data.value, data.resultType, data.ttl);

  App.servicesdb.update({ _id: id }, obj, {}, function (err, num, newDoc) {
          
      if (err) {
          callback(err, 0);
      } 
      else {
          callback(null, num);
      }

  });

}

exports.del = function deleteById(id, callback) {

  App.servicesdb.remove({ _id: id }, {}, function (err, num) {
     
      if (err) {
          callback(err, 0);
      } 
      else {
          callback(null, num);
      }

  });

}