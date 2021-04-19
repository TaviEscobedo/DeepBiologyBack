const express= require('express');
const mysql= require('mysql');
const cors = require('cors')
const bodyParser= require('body-parser');
// const cookieParser= require('cookie-parser')


const PORT=process.env.PORT || 3050;

const app = express();

var corsOptions = {
  origin: '*', // Reemplazar con dominio
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// app.use(cookieParser())

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'deepbiology'
  });

  //Routes

  app.use('/',require('./routes/pages'))
 

//    app.put('/update/:id', (req, res) => {
//        const {id}=req.params;
//        const {nombre, equipo}=req.body;
//        const sql=`UPDATE futbolistas SET nombre='${nombre}', equipo='${equipo}'
//        WHERE id=${id}`;

//        connection.query(sql, error => {
//         if (error) throw error;
//         res.send('Jugador updated!');
//       });
//    });

   
//    app.delete('/delete/:id', (req, res) => {
//        const {id}=req.params;
//     const sql=`DELETE FROM futbolistas WHERE id=${id}`;

//     connection.query(sql, error => {
//         if (error) throw error;
//         res.send('Jugador eliminado!');
//       });
// });


  connection.connect(error=>{
      if(error) throw error;
      console.log('Database server running');
  })
  
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));