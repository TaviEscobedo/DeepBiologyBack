const express= require('express')
const mysql= require('mysql');
const jwt=require('jsonwebtoken')
const bcrypt= require('bcryptjs')

const router= express.Router()

require('dotenv').config()

//conexión de BD
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'deepbiology'
  });


// router.get('/', (req, res) => {
//     res.send('Welcome to my API!');
//   });

router.post('/registro', (req, res) => {
    //  const userObj = req.body;
     const {username, email, password}= req.body;
    //  console.log(userObj)
  
    connection.query('SELECT email FROM users WHERE email = ?',[email],async (error,results)=>{
        if(error){
            console.log('errrrorrrrrr',error);
        }
        if (results.length>0) {
            console.log('hay coincidencia de correos');
          return res.json({message:'Ese correo ya existe, pruebe con otro',key:false}); 
        }

        //si los correos no coinciden, se registra el usuario
        const hashedPassword= await bcrypt.hash(password,8)

        const userObj={
                username,
                email,
                password:hashedPassword
            }
    
            const sql='INSERT INTO users set ?'

            connection.query(sql, userObj,(error,results)=>{
                if(error) throw error
                else{

                    // res.send('usuario regstrado')
                    return res.json({message:'Usuario registrado con éxito, inicie sesión', key:true});
                   // console.log('usuario registrado',results);
                }
            })
    })
 
}); //fin post registro

router.post('/login',(req, res)=>{
        try {
            console.log('login',req.body);
            const {password, email}=req.body;
            
            connection.query('SELECT * FROM users WHERE email=?',[email],async (error, results)=>{

                if(error) throw error;
                console.log('resultado de la BD',results);
                if(results==0)
                {
                    return res.json({message:'Correo no existe'})
                }
                if(!results  || !(await bcrypt.compare(password,results[0].password)))
                {
                  //  console.log('password incorrecto');
                  return res.json({message:'contraseña incorrecta',key:false})
                   
                }else{
                    //  const id=results[0].id
                    // const name=results[0].username
                    const user={
                        id:results[0].id,
                        name:results[0].username
                    }
                    console.log('id del usuario encontrado',user);

                    const token= jwt.sign(user,process.env.SECRET,{
                        expiresIn:'1d'
                    })
                    console.log('el token es: ',token);
                    // res.query()
                    res.header('authorization',token).json({
                        message:'usuario autenticado',
                        token:token,
                        user:user,
                        key:true
                    })
                  
                    // res.status(200).redirect("/")
                }
            })

        } catch (error) {
            console.log(error);
        }    

}) // FIN del la función POST LOGIN

//middleware para validar el token
    function validateToken(req, res, next){
        const accessToken= req.headers['authorization'] || req.query.accesstoken;
        if(!accessToken) res.send('Access denied')

        jwt.verify(accessToken,process.env.SECRET,(err, user)=>{
            if(err)
            { res.send('Access denied, token expired or incorrect')}
            else{
                console.log('user logged', user);
                
                next();
            }

        })
    }


router.post('/comentarios', (req, res) => {
    
         const {cuerpo_comentario, id_clase, id_user, owner}= req.body;
        //  console.log(userObj)

        comentarioObj={
            cuerpo_comentario,
            id_clase,
            id_user,
            owner
        }
                const sql='INSERT INTO comentario set ?'
    
                connection.query(sql, comentarioObj,(error,results)=>{
                    if(error) throw error
                    else{
                        console.log('comentario registrado',results);
                        // res.send('usuario regstrado')
                        return res.json({message:'Comentario registrado con éxito'});
                       // console.log('usuario registrado',results);
                    }
                })
    
}); //fin post comentario


router.get('/comentarios', (req, res) => {
    
            const query_id_clase = req.query.claseId;
            console.log("query del front", query_id_clase)

            const sql=`SELECT * FROM comentario WHERE id_clase=${query_id_clase}`;
            connection.query(sql,(error, results)=>{
                if(error) throw error;
                if(results.length>0){
                    res.json(results);
                    console.log("comentarios por clase",results);
                }else{
                    // res.send('Not results');
                    res.json({
                        message:'not results'
                    })
                }
            })
}); //fin del GET comentarios

// para validar rutas se usa como parámetro validateToken()
    // router.get('/clases',validateToken, (req, res) => {
    router.get('/clases', (req, res) => {
    
        const sql='SELECT * FROM clases';
        connection.query(sql,(error, results)=>{
            if(error) throw error;
            if(results.length>0){
                res.json(results);
                console.log('resultados de BD clases'.results);
            }else{
                res.send('Not results');
                console.log('no hay resultados');
                res.json({
                    message:'not results'
                })
            }
        })
     });


router.get('/clases/:id', (req, res) => {
    
        const { id } = req.params;
      const sql = `SELECT * FROM clases WHERE id = ${id}`;
      connection.query(sql, (error, result) => {
        if (error) throw error;
    
        if (result.length > 0) {
          res.json(result[0]);
          // console.log('respuestaa',result[0])
        } else {
          res.send('Not result');
        }
      });
}); // Fin CLASES por ID

router.post('/favoritos', (req, res) => {
    
    const { id_clase, titulo, descripcion, link, id_user }= req.body;

   
    console.log("favoritos de front",req.body)

   favoObj={
       id_clase,
       titulo,
       descripcion,
       link,
       id_user
   }
           const sql='INSERT INTO favoritos set ?'

           connection.query(sql, favoObj,(error,results)=>{
               if(error) throw error
               else{
                   console.log('favorito registrado',results);
                   // res.send('usuario regstrado')
                   return res.json({message:titulo+' a Favoritos'});
                  // console.log('usuario registrado',results);
               }
           })

}); // FIN de POST FAVORITOS

router.get('/favoritos', (req, res) => {
    
    const query_id_user = req.query.id_user;
    console.log("query del front favoritos", query_id_user)

    const sql=`SELECT * FROM favoritos WHERE id_user=${query_id_user}`;
    connection.query(sql,(error, results)=>{
        if(error) throw error;
        if(results.length>0){
            res.json(results);
            console.log("favoritos por usuario",results);
        }else{
            // res.send('Not results');
            res.json({
                message:'not results'
            })
        }
    })
}); // FIN GET FAVORITOS 

router.delete('/favoritos/:id', (req, res) => {
    const {id}=req.params;

    const sql=`DELETE FROM favoritos WHERE idfavoritos=${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.json({message:'favoritos eliminado!'});
    });
}); // FIN DELETE de FAVORITOS por ID

router.delete('/comentarios/:id', (req, res) => {
    const {id}=req.params;

    const sql=`DELETE FROM comentario WHERE id=${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.json({message:'comentario eliminado!'});
    });
});// FIN DELETE de comentarios por ID



module.exports=router;