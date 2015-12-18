var utils = App.utils('utils');

/***

  Statistics database.

  Object model definition:
  {
    _id : (internal),
    key : (string),
    total : (total number of service calls),
    cacheNum : (number of cache responses),
    cacheAvgTime : (cache response time avg in millis)
    cacheBestTime : (best cached response time in millis)
    noCacheNum : (number of no-cache responses),
    noCacheAvgTime : (no-cache response time avg in millis)
    noCacheBestTime : (best no-cached response time in millis)
    lastCallDate : (date of the last call),
    firstCallDate : (date of the first call)
    deleted : (0=false, 1=true)
  }

  **/

function buildObject(key, total, 
  cacheNum, cacheAvgTime, cacheBestTime,
  noCacheNum, noCacheAvgTime, noCacheBestTime,
  lastCallDate, firstCallDate, deleted) {

  var obj = {
    key:             key,
    total:           total,
    cacheNum:        cacheNum,
    cacheAvgTime:    cacheAvgTime,
    cacheBestTime:   cacheBestTime,
    noCacheNum:      noCacheNum,
    noCacheAvgTime:  noCacheAvgTime,
    noCacheBestTime: noCacheBestTime,
    lastCallDate:    lastCallDate,
    firstCallDate:   firstCallDate,
    deleted:         deleted||0
  }

  return obj;
}

function resetObject(key) {
  var obj = buildObject(key, 0, 0, 0, 0, 0, 0, 0,-1, -1, 0);
  return obj;
}

exports.validation = function validation(obj) {
  return true;
}

exports.selectAll = function selectAll(callback) {

  App.statdb.find({}).sort({ key: 1 }).exec(function(err, result) {
      if (err) {
          callback(err, result);
      } 
      else {
          callback(null, result)
      }
    });

}

exports.selectById = function selectById(id, callback) {

  App.statdb.find({_id:id}, function(err, result) {
      if (err) {
          callback(err, result);
      } 
      else {
          callback(null, result)
      }
    });

}

exports.selectByKey = function selectByKey(key, callback) {

  App.statdb.find({key:key}, function(err, result) {
      if (err) {
          callback(err, result);
      } 
      else {
          callback(null, result)
      }
    });

}

exports.insertOrUpdate = function insertOrUpdate(key, resultIsFromCache, timeInMillis, callback) {

  this.selectByKey(key, function(err, result) {

    if (err) {
      callback(err);
    }
    else if (result.length>0) {

      var tCacheNum    = result[0].cacheNum        || 0;
      var tCacheAvg    = result[0].cacheAvgTime    || -1;
      var tCacheBest   = result[0].cacheBestTime   || -1;
      var tNoCacheNum  = result[0].noCacheNum      || 0;
      var tNoCacheAvg  = result[0].noCacheAvgTime  || -1;
      var tNoCacheBest = result[0].noCacheBestTime || -1;

      if (resultIsFromCache) {
        tCacheNum++;
        tCacheAvg  = (tCacheAvg+timeInMillis)/2;
        tCacheBest = (tCacheBest<0 || timeInMillis < tCacheBest) ? timeInMillis : tCacheBest;
      }
      else {
        tNoCacheNum++;
        tNoCacheAvg  = (tNoCacheAvg+timeInMillis)/2;
        tNoCacheBest = (tNoCacheBest<0 || timeInMillis < tNoCacheBest) ? timeInMillis : tNoCacheBest;
      }

      var obj = buildObject(
        key, 
        result[0].total + 1, 
        tCacheNum,
        tCacheAvg, 
        tCacheBest, 
        tNoCacheNum, 
        tNoCacheAvg, 
        tNoCacheBest,
        utils.getFormatDate(), 
        result[0].firstCallDate == -1 ? utils.getFormatDate() : result[0].firstCallDate, 
        result[0].deleted);

      App.statdb.update({ _id: result[0]._id }, obj, {}, function (err, num, newDoc) {
        if (err) {
          callback(err, newDoc);
        } 
        else {
          callback(null, newDoc);
        }
      });

    }
    else {

      var obj = buildObject(
        key, 
        1, 
        0,
        0, 
        -1, 
        1, 
        timeInMillis, 
        timeInMillis,
        utils.getFormatDate(), 
        utils.getFormatDate(), 
        0);      

      App.statdb.insert( obj , function(err, newObj) {
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

exports.reset = function resetByKey(key, callback) {

  this.selectByKey(key, function(err, result) {

    if (err) {
      callback(err);
    }
    else if (result.length>0) {

      var obj = resetObject(key);

      App.statdb.update({ _id: result[0]._id }, obj, {}, function (err, num) {
        if (err) {
          callback(err, 0);
        } 
        else {
          callback(null, num);
        }
      });

    }

  });
}


exports.del = function deleteById(id, callback) {

  App.statdb.remove({ _id: id }, {}, function (err, num) {
     
      if (err) {
          callback(err, 0);
      } 
      else {
          callback(null, num);
      }

  });

}