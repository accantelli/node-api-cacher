/***

  Configuration settings database.

  Object model definition:
  {
    _id : (internal),
    key : (string),
    value : (int or string)
  }
  
  **/

function buildObject(key, value, ttl) {

  var obj = {
    key   : key,
    value : value
  }

  return obj;
}

exports.validation = function validation(obj) {
  return true;
}

exports.selectAll = function selectAll(callback) {

  App.confdb.find({}).sort({ key: 1 }).exec(function(err, result) {
      if (err) {
          callback(err, result);
      } 
      else {
          callback(null, result)
      }
    });

}

exports.selectById = function selectById(id, callback) {

  App.confdb.find({_id:id}, function(err, result) {
      if (err) {
          callback(err, result);
      } 
      else {
          callback(null, result)
      }
    });

}

exports.selectByKey = function selectByKey(key, callback) {

  App.confdb.find({key:key}, function(err, result) {
      if (err) {
          callback(err, result);
      } 
      else {
          callback(null, result)
      }
    });

}

exports.insert = function insert(data, callback) {

  var obj = buildObject(data.key, data.value);
 
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

      App.confdb.insert( obj , function(err, newObj) {
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

  var obj = buildObject(data.key, data.value);  

  App.confdb.update({ _id: id }, obj, {}, function (err, num, newDoc) {
          
      if (err) {
          callback(err, 0);
      } 
      else {
          callback(null, num);
      }

  });

}

exports.del = function deleteById(id, callback) {

  App.confdb.remove({ _id: id }, {}, function (err, num) {
     
      if (err) {
          callback(err, 0);
      } 
      else {
          callback(null, num);
      }

  });

}