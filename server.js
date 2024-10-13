const express = require('express');
const cors = require('cors');
//const mysql = require('mysql2/promise')
const app = express();
const cron = require('node-cron');
app.disable('x-powered-by')
const fs = require('fs');
let latest = require('./latest.json')
let currencies = require('./currencies.json')
const PORT = process.env.PORT ?? 3000;

//Usando solo origenes que vos quieras que tengan  acceso a tu API
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4200', 'https://prueba-tecnica-weso.vercel.app/'];
        if (allowedOrigins.includes(origin) || !origin) {
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
    }
}))
app.use(express.json())
const apiKey = 'd355bd35ee32483fba09a438677c6daf'

function getFetch(url) {
    return fetch(url).then(api => {
        if (!api.ok) {
            throw new Error("Error en el servidor: " + api.statusText + "/" + api.status)
        }
        return api.json()
    })
}
cron.schedule('0 0 * * *', async () => {
    /////------Save data--------//////
    let url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`
    try {
        let latestJson = await getFetch(url);
        if (!latestJson || !latestJson.rates) {
            throw new Error('Datos inválidos para latest.json');
        }
        latest = latestJson.rates;
        fs.writeFileSync('./latest.json', JSON.stringify(latest, null, 2)); // sobrescribe  el archivo
        console.log('actualizado')
    } catch (error) {
        console.log('error' + error)
        throw new Error('Error latest:' + error)
    }
    url = `https://openexchangerates.org/api/currencies.json?app_id=${apiKey}`
    try {
        let currenciesJson = await getFetch(url);
        currencies = currenciesJson
        fs.writeFileSync('./currencies.json', JSON.stringify(currencies, null, 2)); 
        console.log('actualizado')
    } catch (error) {
        console.log('error' + error)
        throw new Error('Error currency:' + error)
    }
})

app.get('/latest', async (req, res) => {
    res.json(latest)
})

app.get('/currencies', async (req, res) => {
    res.json(currencies);
})
app.get('/historical/:year-:month-:day', (req, res) => {
    // Pedido de datos a la api
    const { year, month, day } = req.params
    const url = `https://openexchangerates.org/api/historical/${year}-${month}-${day}.json?app_id=${apiKey}`
    getFetch(url).then(apiHistorical => {
        res.status(200).json(apiHistorical.rates)
    }).catch(error => {
        const statusCode = error.status || 500;
        res.status(statusCode).json({ error: error.message });
    })
})



// Inicio del servidor
app.listen(PORT, () => {
    console.log(`API listening at http://localhost:${PORT}`);
})