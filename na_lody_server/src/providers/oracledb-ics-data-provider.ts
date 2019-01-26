import { IICSDataProvider } from "../models/iics-data-provider";
import { IcecreamShop } from "../models/icecreamshop";
const oracledb = require("oracledb");
const config = require("./config.js");

export class OracleDBICSDataProvider implements IICSDataProvider {

    private static instance: OracleDBICSDataProvider;

    private constructor() {
        process.once("SIGINT", async () => {
            await this.closePoolAndExit();
        });
        process.once("SIGTERM", async () => {
            await this.closePoolAndExit();
        });
    }

    static getInstance() {
        if(this.instance) {
            return this.instance
        } else {
            this.instance = new OracleDBICSDataProvider();
            return this.instance;
        }
    }

    async init() {
        await oracledb.createPool(config);
        console.log("Connection pool initialised");
    }
      
    async closePoolAndExit() {
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

    async executeStatement(connection: any, sqlStatement: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await connection.execute(sqlStatement, {}, {outFormat: oracledb.OBJECT});
                resolve(data);
            } catch (err) {
                reject(err);
            }
        });
    }

    parseIcecreamShopsData(response: any): IcecreamShop[] {
        let data = response.rows;
        return data.map((item: any) => {
            return {
                id: item["ICS_ID"],
                name: item["NAME"],
                logoUrl: item["LOGO_URL"],
                additionalInfo: item["ADDITIONAL_INFO"],
                address: {
                    city: item["CITY"],
                    street: item["STREET"],
                    latitude: item["LATITUDE"],
                    longitude: item["LONGITUDE"],
                }
            };
        });
    }

    parseFlavours(response: any): string[] {
        let data = response.rows;
        return data.map((item: any) => item["FLAVOUR"]);
    }

    async appendFlavours(connection: any, data: IcecreamShop[]): Promise<IcecreamShop[]> {
        return new Promise(async (resolve, reject) => {
            try {
                for(let i=0; i < data.length; i++) {
                    let sqlStatement = `SELECT FLAVOUR FROM FLAVOURS WHERE ICS_ID = ${data[i].id}`
                    let response = await this.executeStatement(connection, sqlStatement)
                    response = this.parseFlavours(response);
                    data[i].flavours = response;
                }
                resolve(data);
            } catch (err) {
                reject(err)
            }
        });
    }

    async getCompleteICSObject(connection: any, sqlStatement: string): Promise<IcecreamShop[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.executeStatement(connection, sqlStatement);
                response = this.parseIcecreamShopsData(response);
                response = await this.appendFlavours(connection, response);
                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    getAll(): Promise<IcecreamShop[]> {
        return new Promise(async (resolve, reject) => {
            let conn;
            const sqlStatement = `SELECT ICS_ID, NAME, LOGO_URL, ADDITIONAL_INFO, CITY, STREET, LATITUDE, LONGITUDE FROM ICECREAMSHOPS JOIN ADDRESSES USING(ICS_ID)`;
            try {
                conn = await oracledb.getConnection();
                const response = await this.getCompleteICSObject(conn, sqlStatement);
                resolve(response);
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
    getById(icsId: number): Promise<IcecreamShop> {
        return new Promise(async (resolve, reject) => {
            let conn;
            const sqlStatement = `SELECT ICS_ID, NAME, LOGO_URL, ADDITIONAL_INFO, CITY, STREET, LATITUDE, LONGITUDE FROM ICECREAMSHOPS JOIN ADDRESSES USING(ICS_ID) WHERE ICS_ID = ${icsId}`;
            try {
                conn = await oracledb.getConnection();
                const response = await this.getCompleteICSObject(conn, sqlStatement);
                resolve(response[0]);
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
    getByCity(city: string): Promise<IcecreamShop[]> {
        return new Promise(async (resolve, reject) => {
            let conn;
            const sqlStatement = `SELECT ICS_ID, NAME, LOGO_URL, ADDITIONAL_INFO, CITY, STREET, LATITUDE, LONGITUDE FROM ICECREAMSHOPS JOIN ADDRESSES USING(ICS_ID) WHERE LOWER(CITY) LIKE '%${city.toLowerCase()}%'`;
            try {
                conn = await oracledb.getConnection();
                const response = await this.getCompleteICSObject(conn, sqlStatement);
                resolve(response);
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
    getByName(name: string): Promise<IcecreamShop[]> {
        return new Promise(async (resolve, reject) => {
            let conn;
            const sqlStatement = `SELECT ICS_ID, NAME, LOGO_URL, ADDITIONAL_INFO, CITY, STREET, LATITUDE, LONGITUDE FROM ICECREAMSHOPS JOIN ADDRESSES USING(ICS_ID) WHERE LOWER(NAME) LIKE '%${name.toLowerCase()}%'`;
            try {
                conn = await oracledb.getConnection();
                const response = await this.getCompleteICSObject(conn, sqlStatement);
                resolve(response);
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
    getWithinRange(lat: number, lng: number, rad: number): Promise<IcecreamShop[]> {
        return new Promise(async (resolve, reject) => {
            let conn;
            const sqlStatement = `SELECT ICS_ID, NAME, LOGO_URL, ADDITIONAL_INFO, CITY, STREET, LATITUDE, LONGITUDE FROM ICECREAMSHOPS JOIN ADDRESSES USING(ICS_ID) WHERE COUNT_DISTANCE(LATITUDE, LONGITUDE, '${lat}', '${lng}') < ${rad}`
            try {
                conn = await oracledb.getConnection();
                const response = await this.getCompleteICSObject(conn, sqlStatement);
                resolve(response);
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
    getFlavours(icsId: number): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            let conn;
            const sqlStatement = `SELECT FLAVOUR FROM FLAVOURS WHERE ICS_ID = ${icsId}`;
            try {
                conn = await oracledb.getConnection();
                let response = await this.executeStatement(conn, sqlStatement)
                response = this.parseFlavours(response);
                resolve(response);    
            } catch(err) {
                reject(err)
            } finally {
                if(conn) {
                    await conn.close();
                }
            }
        });
    }
    getFavorites(favorites: number[]): Promise<IcecreamShop[]> {
        return new Promise(async (resolve, reject) => {
            let conn;
            const sqlStatement = `SELECT ICS_ID, NAME, LOGO_URL, ADDITIONAL_INFO, CITY, STREET, LATITUDE, LONGITUDE FROM ICECREAMSHOPS JOIN ADDRESSES USING(ICS_ID) WHERE ICS_ID IN (${favorites})`;
            try {
                conn = await oracledb.getConnection();
                const response = await this.getCompleteICSObject(conn, sqlStatement);
                resolve(response);
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
    add(data: IcecreamShop): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let conn;
            try {
                conn = await oracledb.getConnection();
                let id = await this.executeStatement(conn, 'SELECT ICS_ID_SEQ.NEXTVAL FROM DUAL');
                id = id.rows[0]["NEXTVAL"];
                const insertIntoICS = `INSERT INTO ICECREAMSHOPS (ICS_ID, NAME, LOGO_URL, ADDITIONAL_INFO) VALUES (${id}, '${data.name}', '${data.logoUrl}', '${data.additionalInfo}')`;
                const insertIntoAddresses = `INSERT INTO ADDRESSES (ICS_ID, CITY, STREET, LATITUDE, LONGITUDE) VALUES (${id}, '${data.address.city}', '${data.address.street}', ${data.address.latitude}, ${data.address.longitude})`;
                await this.executeStatement(conn, insertIntoICS);
                await this.executeStatement(conn, insertIntoAddresses);
                for(let i = 0; i < data.flavours.length; i++) {
                    let insertIntoFlavours = `INSERT INTO FLAVOURS (ICS_ID, FLAVOUR) VALUES (${id}, '${data.flavours[i]}')`;
                    await this.executeStatement(conn, insertIntoFlavours);
                }
                conn.commit();
                resolve(true);
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
    update(data: IcecreamShop): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let conn;
            try {
                conn = await oracledb.getConnection();
                const updateICS = `UPDATE ICECREAMSHOPS SET NAME = '${data.name}', LOGO_URL = '${data.logoUrl}', ADDITIONAL_INFO = '${data.additionalInfo}' WHERE ICS_ID = ${data.id}`;
                const updateAddresses = `UPDATE ADDRESSES SET CITY = '${data.address.city}', STREET = '${data.address.street}', LATITUDE = ${data.address.latitude}, LONGITUDE = ${data.address.longitude} WHERE ICS_ID = ${data.id}`;
                const clearFlavours = `DELETE FLAVOURS WHERE ICS_ID = ${data.id}`;
                await this.executeStatement(conn, updateICS);
                await this.executeStatement(conn, updateAddresses);
                await this.executeStatement(conn, clearFlavours);
                for(let i = 0; i < data.flavours.length; i++) {
                    let insertIntoFlavours = `INSERT INTO FLAVOURS (ICS_ID, FLAVOUR) VALUES (${data.id}, '${data.flavours[i]}')`;
                    await this.executeStatement(conn, insertIntoFlavours);
                }
                conn.commit();
                resolve(true);
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
    deleteIcecreamShop(icsId: number): Promise<boolean> {
        return new Promise(async(resolve, reject) => {
            let conn;
            try {
                conn = await oracledb.getConnection();
                await this.executeStatement(conn, `DELETE ICECREAMSHOPS WHERE ICS_ID = ${icsId}`);
                conn.commit();
                resolve(true);
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
    addFlavour(icsId: number, flavour: string): Promise<boolean> {
        return new Promise(async(resolve, reject) => {
            let conn;
            try {
                conn = await oracledb.getConnection();
                let duplicates = await this.executeStatement(conn, `SELECT COUNT(*) FROM FLAVOURS WHERE ICS_ID = ${icsId} AND FLAVOUR = '${flavour}'`);
                duplicates = duplicates.rows[0]["COUNT(*)"];
                if(duplicates === 0) {
                    await this.executeStatement(conn, `INSERT INTO FLAVOURS (ICS_ID, FLAVOUR) VALUES (${icsId}, '${flavour}')`);
                    conn.commit();
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
    deleteFlavour(icsId: number, flavour: string): Promise<boolean> {
        return new Promise(async(resolve, reject) => {
            let conn;
            try {
                conn = await oracledb.getConnection();
                await this.executeStatement(conn, `DELETE FLAVOURS WHERE ICS_ID = ${icsId} AND FLAVOUR = '${flavour}'`);
                conn.commit();
                resolve(true);
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    await conn.close();
                }
            }
        });
    }
}