const oracledb = require('oracledb');
const config = require('./config');

async function getICSId(conn) {
  try {
    const response = await conn.execute('select ics_id_seq.nextval from dual');
    return response.rows[0];
  }
  catch(err) {
    console.log(err);
    return -1;
  }
}

async function insertIntoIcecreamshops(conn, id, name, logoUrl, additionalInfo) {
  try {
    await conn.execute(`insert into icecreamshops values (${id}, '${name}', '${logoUrl}', '${additionalInfo}')`);
    return true;
  }
  catch(err) {
    console.log(err);
    return false;
  }
}

async function insertIntoFlavours(conn, id, flavour) {
  try {
    await conn.execute(`insert into flavours (ics_id, flavour) values (${id}, '${flavour}')`);
    return true;
  }
  catch(err) {
    console.log(err);
    return false;
  }
}

async function insertIntoAddresses(conn, id, city, street, latitude, longitude) {
  try {
    await conn.execute(`insert into addresses (ics_id, city, street, latitude, longitude) values (${id}, '${city}', '${street}', ${latitude}, ${longitude} )`);
    return true;
  }
  catch(err) {
    console.log(err);
    return false;
  }
}

async function getFlavours(id) {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const flavours = await conn.execute(
      `select flavour from flavours where ics_id = ${id}`
    );
    return flavours;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
       await conn.close();
    }
  }
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
      `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where ics_id in (${favorites})`
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

async function getIcecreamShopsWithinRange(latitude, longitude, range) {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const icecreamShops = await conn.execute(
      `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where count_distance(latitude, longitude, '${latitude}', '${longitude}') < ${range}`
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

async function getAll() {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const icecreamShops = await conn.execute(
      `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id)`
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

async function deleteIcecreamShop(id) {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    await conn.execute(`DELETE FROM ICECREAMSHOPS WHERE ICS_ID = ${id}`);
    return 204;
  } catch (err) {
    console.log(err);
    return 500;
  } finally {
    if (conn) {
       await conn.close();
    }
  }
}

async function addIcecreamShop(icecreamshop) {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const id = await getICSId(conn);
    if(await insertIntoIcecreamshops(conn, id, icecreamshop.name, icecreamshop.logoUrl, icecreamshop.additionalInfo)) {
      if(!await insertIntoAddresses(conn, id, icecreamshop.address.city, icecreamshop.address.street, icecreamshop.address.latitude, icecreamshop.address.longitude)){
        throw new Error('Failed to add address');
      }
      for(let flavour of icecreamshop.flavours) {
        if(!await insertIntoFlavours(conn, id, flavour)) {
          return 500;
        }
      }
      conn.commit();
      return 201;
    } else {
      return 500;
    }
  } catch (err) {
    console.log(err);
    return 500;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

module.exports = {
  getIcecreamShopsWithinRange,
  getIcecreamShopById,
  getFavoriteIcecreamShops,
  getIcecreamShopsByCity,
  getFlavours,
  addIcecreamShop,
  deleteIcecreamShop,
  getAll
};