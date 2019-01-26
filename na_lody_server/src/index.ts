import { Application } from "express";
import { FileICSDataProvider } from "./providers/file-ics-data-provider";
import { ICSController } from "./controllers/ics-controller";
import { IICSDataProvider } from "./models/iics-data-provider";
import { OracleDBICSDataProvider } from "./providers/oracledb-ics-data-provider";

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app: Application = express();

app.use(bodyParser.json());
app.use(cors());

const oracledbProvider = OracleDBICSDataProvider.getInstance();
oracledbProvider.init().then(() => {
    app.use('/icecreamshops', new ICSController(oracledbProvider).getRoutes());
    console.log('Server started sucessfully');
})

// app.use('/icecreamshops', new ICSController(new FileICSDataProvider('new/providers/data.json')).getRoutes());

app.listen(3000);