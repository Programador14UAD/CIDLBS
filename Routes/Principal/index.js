const express = require('express');
const router = express.Router();
const { TYPES } = require('tedious');
const pool = require('../../settings/db'); 
const sql = require('../../settings/db2'); 
const yup = require('yup');
const validator = require('validator');

const usuarioschema = yup.object().shape({
    idusuario : yup.number().required()
});
const sanitize = (input) => validator.escape(String(input));

router.post('/AltaLibrosUsuarioEspecial', async (req, res) => {
  const response = 
  {
    error: false,
    codigo: 200,
    mensaje: '',
    datos: ''
  };

  try 
  {
    const body = 
    {
      idusuario: sanitize(req.body.ID_usuario)
    };

    await usuarioschema.validate(body);
    const results1 = await sql.sql( 
      "Exec dbo.UsuariosRelacionCarreraLibros_GetLibrosUsuario @ID_Usuario")
    .parameter('ID_Usuario',TYPES.Int, body.idusuario).execute();

    const datos = results1 || [];
    //console.log(datos);
    for (let i = 0; i < datos.length; i++) 
      {
        const info = datos[i];
        
        await pool.query(
          'CALL ommega.LibrosUsuarios_Post(?,?,?,?,?)',
          [info.Usuario, info.ID_LBS, info.Nivel, info.ID_Carrera_Ommega, info.Tipo]
        );
      }
      
    response.datos = results1;
    return res.status(200).send(response);

  } 
  catch (err) 
  {
    response.error = true;
    response.codigo = 500;
          
    if (err.name === 'ValidationError') 
    {
      response.codigo = 400;
      response.mensaje = `Validación fallida: ${err.message}`;
      return res.status(400).send(response);
    }

    response.mensaje = 'Error al ejecutar el procedimiento almacenado';
    console.error('[ERROR BAJA]', err.message);
    return res.status(500).send(response);
  }
});

module.exports = router;