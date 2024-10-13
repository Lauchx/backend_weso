const express = require('express');
const cors = require('cors');
//const mysql = require('mysql2/promise')
const app = express();
//const cron = require('node-cron');
app.disable('x-powered-by')
const PORT = process.env.PORT ?? 3000;

//Usando solo origenes que vos quieras que tengan  acceso a tu API
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4200'];
        if (allowedOrigins.includes(origin) || !origin) {
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
    }
}))
app.use(express.json())
const apiKey = 'd355bd35ee32483fba09a438677c6daf'

// async function createConnection() {
    //     try {
        //         const connection = await mysql.createConnection({
            //             host: 'localhost',
            //             user: 'root',
            //             port: 3306,
            //             password: 'root',
            //             database: 'exchange'
            //         });
            //         console.log('Conexión a la base de datos establecida.')
            //         return connection;
            //     } catch (error) {
                //         console.error('Error al conectarse a la base de datos:', error);
                //         throw error; // Lanza el error para que se pueda manejar más tarde
                //     }
                // }
                
                

                function getFetch(url) {
    return fetch(url).then(api => {
        if (!api.ok) {
            throw new Error("Error en el servidor: " + api.statusText + "/" + api.status)
        }
        return api.json()
    })
}
// cron.schedule('0 0 * * *', async () => {
    //     console.log('entro')
    //     const connection = await createConnection()
    //     let url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`
    //     try {
        //         let latestJson = await getFetch(url);
        //         let latest = latestJson.rates;
        
        //         for (const key in latest) { //  recorre el objeto
        //             const value = latest[key]; // rescatando el valor dentro de los atributos
        //             await connection.query("INSERT INTO latest(id, value) VALUES(?, ?) ON DUPLICATE KEY UPDATE value = ?", [key, value, value]) // inserta o actualiza el valor, en la base de datos 
        //         }
        //         console.log('actualizado')
        //     } catch (error) {
            //         console.log('error' + error)
            //         throw new Error('Error:' + error)
            //     }
            //     /////------Save currencies data--------//////
            //     url = `https://openexchangerates.org/api/currencies.json?app_id=${apiKey}`
            //     try {
                //         let currenciesJson = await getFetch(url);
                //         for (const key in currenciesJson) {
                    //             const value = currenciesJson[key];
                    //             await connection.query("INSERT INTO currencies(id, name) VALUES(?, ?) ON DUPLICATE KEY UPDATE name = ?", [key, value, value])
                    //         }
                    //         console.log('actualizado')
                    //     } catch (error) {
                        //         console.log('error' + error)
                        //         throw new Error('Error:' + error)
                        //     }
                        
                        
                        // })


                        app.get('/latest', async (req, res) => {
                            // try {
                                //     const connection = await createConnection()
                                //     const [rows] = await connection.query('SELECT id, value FROM latest')
                                //     res.json(rows)
                                // } catch (error) {
                                    //     console.error('Error al obtener datos:', error);
                                    //     const stauts = error.stats || 500 
                                    //     res.status(stauts).json({ error: 'Error al obtener datos' }); 
                                    // }
                                })
                                
const currencies = require('./currencies.json')
app.get('/currencies', async (req, res) => {
    // try {
    //     const connection = await createConnection()
    //     const [rows] = await connection.query('SELECT id, name FROM currencies')
    //     res.json(rows)
    // } catch (error) {
    //     console.error('Error al obtener datos:', error);
    //     const stauts = error.stats || 500 
    //     res.status(stauts).json({ error: 'Error al obtener datos' }); 
    // }
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



// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`API listening at http://localhost:${PORT}`);
})