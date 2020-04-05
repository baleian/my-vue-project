import dbcon from '../db';

export function query(query, params) {
  return new Promise((resolve, reject) => {
    function callback(err, results) {
      if (err) return reject(err);
      resolve(results);
    }
    if (!params) {
      dbcon.query(query, callback);
    } 
    else {
      dbcon.execute(query, params, callback);
    }
  });
}

export async function selectOne(_query, params) {
  if (_query.trim().indexOf('SELECT') !== 0) {
    throw Error('query must be started with "SELECT"');
  }
  var result = await query(_query, params);
  if (!result || !result.length) return null;
  return result[0];
}
