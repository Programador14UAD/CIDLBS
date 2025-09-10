const express = require('express');
const router = express.Router();
const pool = require('../../settings/db'); 
const yup = require('yup');
const validator = require('validator');

const insertarschema = yup.object().shape({
    usuario: yup.string().required(),
    nombre: yup.string().required(),
    paterno: yup.string().required(),
    //materno : yup.string().required(),
    pass: yup.string().required(),
    tipo : yup.string().required(),
   // grado : yup.string().required(),
    //grupo: yup.string().required(),
    escolaridad: yup.string().required(),
    id_campus: yup.number().required(),
    activo: yup.string().required(),
    eliminado: yup.string().required()
});

const estadoschema = yup.object().shape({
    usuario : yup.string().required(),
    pass : yup.string().required(),
    activo : yup.string().required(),
    eliminado : yup.string().required()
});
const sanitize = (input) => validator.escape(String(input));

router.post('/insertar', async (req, res) => {
  let response = 
  {
    error: false,
    codigo: 200,
    mensaje: '',
    datos: ''
  };
  try 
  {
    const body= 
    {
      usuario : sanitize(req.body.usuario),
      nombre : sanitize(req.body.nombre),
      paterno: sanitize(req.body.paterno),
      //materno: sanitize(req.body.materno),
      pass: sanitize(req.body.pass),
      tipo: sanitize(req.body.tipo),
      //grado: sanitize(req.body.grado),
      //grupo: sanitize(req.body.grupo),
      escolaridad: sanitize(req.body.escolaridad),
      id_campus: parseInt(req.body.id_campus),
      activo: sanitize(req.body.activo),
      eliminado: sanitize(req.body.eliminado)
    };

    const gradoIngles=req.body.gradoIngles;
    const grupoIngles=req.body.grupoIngles;
    const grado = req.body.grado;
    const grupo = req.body.grupo
    const materno = req.body.materno;
    await insertarschema.validate(body);
 
    const [results] = await pool.query(
      'CALL ommega.Usuarios_Post(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [body.usuario, body.nombre, body.paterno, materno, body.pass, 
        body.tipo, grado, grupo, gradoIngles, grupoIngles,
        body.escolaridad, body.id_campus, body.activo, body.eliminado]
    );

    const datos = results?.[0] || [];
    response.mensaje = datos.length === 0 
        ? 'No existe el usuario'
         : 'Se ha insertado el usuario';
    response.datos = datos;

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
    console.error('[ERROR ALTA Usuario]', err.message);
    return res.status(500).send(response);
  }
});

router.post('/modificar-estado', async (req, res) => 
{
  let response = 
  {
    error: false,
    codigo: 200,
    mensaje: '',
    datos: ''
  };

  const body =
  { 
    usuario: sanitize(req.body.usuario),
    pass: sanitize(req.body.pass), 
    activo: sanitize(req.body.activo),
    eliminado: sanitize(req.body.eliminado) 
  };
  await estadoschema.validate(body); 
  
  try 
  {
    const [results] = await pool.query(
      'CALL ommega.Usuarios_ModificarEstatus(?,?,?,?)',
      [body.usuario, body.pass, body.activo, body.eliminado]
    );
    const datos = results?.[0] || [];
    response.mensaje = datos.length === 0 ? 'No existe el usuario' : 'Se ha actualizado el estado';
    response.datos = datos;
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
    console.error('[ERROR Modificar]', err.message);
    return res.status(500).send(response);
  }
  
});

module.exports = router;