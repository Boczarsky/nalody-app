const oracledb = require("oracledb");
const config = require("./config");

async function init() {
  await oracledb.createPool(config);
  console.log("Connection pool started");
}

async function closePoolAndExit() {
  console.log("\nTerminating");
  try {
    await oracledb.getPool().close(10);
    console.log("Pool closed");
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

//---------------------------------------------------------------------------------
// GET
//---------------------------------------------------------------------------------

async function getAllIcecreamShops() {
  let conn;
  const sqlStatement = `SELECT ICS_ID, NAME, LOGO_URL, ADDITIONAL_INFO, CITY, STREET, LATITUDE, LONGITUDE FROM ICECREAMSHOPS JOIN ADDRESSES USING(ICS_ID)`;
  try {
    conn = await oracledb.getConnection();
    const icecreamShops = await conn.execute(sqlStatement);
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
  const sqlStatement = `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where ics_id = ${id}`;
  try {
    conn = await oracledb.getConnection();
    const icecreamShops = await conn.execute(sqlStatement);
    return icecreamShops;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function getIcecreamShopByName(name) {
  let conn;
  const sqlStatement = `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where lower(name) like '%${name.toLowerCase()}%'`;
  try {
    conn = await oracledb.getConnection();
    const icecreamShops = await conn.execute(sqlStatement);
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
  const sqlStatement = `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where count_distance(latitude, longitude, '${latitude}', '${longitude}') < ${range}`;
  try {
    conn = await oracledb.getConnection();
    const icecreamShops = await conn.execute(sqlStatement);
    return icecreamShops;
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
  const sqlStatement = `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where lower(city) like '%${city.toLowerCase()}%'`;
  try {
    conn = await oracledb.getConnection();
    const icecreamShops = await conn.execute(sqlStatement);
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
  const sqlStatement = `select ics_id, name, logo_url, additional_info, city, street, latitude, longitude from icecreamshops join addresses using(ics_id) where ics_id in (${favorites})`;
  try {
    conn = await oracledb.getConnection();
    const icecreamShops = await conn.execute(sqlStatement);
    return icecreamShops;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function getFlavours(id) {
  let conn;
  const sqlStatement = `select flavour from flavours where ics_id = ${id}`;
  try {
    conn = await oracledb.getConnection();
    const flavours = await conn.execute(sqlStatement);
    return flavours;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function getICSId(conn) {
  const sqlStatement = "select ics_id_seq.nextval from dual";
  try {
    const response = await conn.execute(sqlStatement);
    return response.rows[0];
  } catch (err) {
    console.log(err);
    return -1;
  }
}

//---------------------------------------------------------------------------------
// POST
//---------------------------------------------------------------------------------

async function addIcecreamShop(icecreamshop) {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const id = await getICSId(conn);
    if (
      await insertIntoIcecreamshops(
        conn,
        id,
        icecreamshop.name,
        icecreamshop.logoUrl,
        icecreamshop.additionalInfo
      )
    ) {
      if (
        !(await insertIntoAddresses(
          conn,
          id,
          icecreamshop.address.city,
          icecreamshop.address.street,
          icecreamshop.address.latitude,
          icecreamshop.address.longitude
        ))
      ) {
        throw new Error("Failed to add address");
      }
      for (let flavour of icecreamshop.flavours) {
        if (!(await insertIntoFlavours(conn, id, flavour))) {
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

async function insertIntoIcecreamshops(
  conn,
  id,
  name,
  logoUrl,
  additionalInfo
) {
  const sqlStatement = `insert into icecreamshops values (${id}, '${name}', '${logoUrl}', '${additionalInfo}')`;
  try {
    await conn.execute(sqlStatement);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function insertIntoAddresses(
  conn,
  id,
  city,
  street,
  latitude,
  longitude
) {
  const sqlStatement = `insert into addresses (ics_id, city, street, latitude, longitude) values (${id}, '${city}', '${street}', ${latitude}, ${longitude} )`;
  try {
    await conn.execute(sqlStatement);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function insertIntoFlavours(conn, id, flavour) {
  const sqlStatement = `insert into flavours (ics_id, flavour) values (${id}, '${flavour}')`;
  try {
    await conn.execute(sqlStatement);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function addFlavour(id, flavour) {
  let conn;
  const sqlStatement = `insert into flavours (ics_id, flavour) values (${id}, '${flavour}')`;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(sqlStatement);
    await conn.commit();
    return 201;
  } catch (err) {
    console.log(err);
    return 500;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

//---------------------------------------------------------------------------------
// DELETE
//---------------------------------------------------------------------------------

async function deleteIcecreamShop(id) {
  let conn;
  const sqlStatement = `DELETE FROM ICECREAMSHOPS WHERE ICS_ID = ${id}`;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(sqlStatement);
    await conn.commit();
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

async function deleteFlavour(id, flavour) {
  let conn;
  const sqlStatement = `delete flavours where ics_id = ${id} and lower(flavour) like '${flavour.toLowerCase()}'`;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(sqlStatement);
    await conn.commit();
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

//---------------------------------------------------------------------------------
// PUT
//---------------------------------------------------------------------------------

async function updateAddress(id, city, street, latitude, longitude) {
  let conn;
  const sqlStatement = `update addresses set city = '${city}', street = '${street}', latitude = ${latitude}, longitude = ${longitude} where ics_id = ${id}`;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(sqlStatement);
    await conn.commit();
    return 204;
  } catch(err) {
    console.log(err);
    return 500;
  } finally {
    if(conn) {
      await conn.close();
    }
  }
}

async function updateIcecreamshop(id, name, logoUrl, additionalInfo) {
  let conn;
  const sqlStatement = `update icecreamshops set name = '${name}', logo_url = '${logoUrl}', additional_info = '${additionalInfo}' where ics_id = ${id}`;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(sqlStatement);
    await conn.commit();
    return 204;
  } catch(err) {
    console.log(err);
    return 500;
  } finally {
    if(conn) {
      await conn.close();
    }
  }
}

module.exports = {
  addFlavour,
  addIcecreamShop,
  closePoolAndExit,
  deleteFlavour,
  deleteIcecreamShop,
  getAllIcecreamShops,
  getFavoriteIcecreamShops,
  getFlavours,
  getIcecreamShopById,
  getIcecreamShopsByCity,
  getIcecreamShopByName,
  getIcecreamShopsWithinRange,
  init,
  updateAddress,
  updateIcecreamshop,
};
