const oracledb = require('oracledb');
const config = require('./config');

async function insertIntoIcecreamShops(data) {
  const {name, address, logoUrl, additionalInfo, flavours} = data;
}

async function getIcecreamShopsByCity(city) {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const icecreamShops = await conn.execute(
      `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where city like '${city}'`
    );
    return icecreamShops;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
       await conn.close();
    }
  }
}

async function getFavoriteIcecreamShops(favorites) {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const icecreamShops = await conn.execute(
      `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where ics_id in [${favorites}]`
    );
    return icecreamShops;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
       await conn.close();
    }
  }
}

async function getIcecreamShopById(id) {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const icecreamShops = await conn.execute(
      `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where ics_id = ${id}`
    );
    return icecreamShops;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
       await conn.close();
    }
  }
}

async function getIcecreamShopsWithinRange(latitiude, longitude, range) {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const icecreamShops = await conn.execute(
      `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where count_distance(latitude, longitude, '${latitiude}', '${longitude}') < ${range}`
    );
    return icecreamShops;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
       await conn.close();
    }
  }
}

module.exports = {getIcecreamShopsWithinRange, getIcecreamShopById, getFavoriteIcecreamShops, getIcecreamShopsByCity, insertIntoIcecreamShops};