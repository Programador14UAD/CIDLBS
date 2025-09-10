const express = require('express');
const router = express.Router();
const pool = require('../../settings/db'); 
const yup = require('yup');
const validator = require('validator');

const altaSchema = yup.object().shape({
  usuario: yup.string().required(),
  grupo: yup.string().required(),
  grado: yup.string().required(),
  grupoingles: yup.string().required(),
  escolaridad: yup.string().required(),
  id_campus: yup.number().required(),
  id_materia: yup.number().required(),
  idioma: yup.string().required()
});

const bajaSchema = yup.object().shape({
  usuario: yup.string().required(),
  grupo: yup.string().required(),
  grado: yup.string().required(),
  grupoingles: yup.string().required(),
  escolaridad: yup.string().required()
});

const sanitize = (input) => validator.escape(String(input));


router.post('/alta', async (req, res) => {
  const response = {
    error: false,
    codigo: 200,
    mensaje: '',
    datos: ''
  };

  try {
    const body = {
      usuario: sanitize(req.body.usuario),
      grupo: sanitize(req.body.grupo),
      grado: sanitize(req.body.grado),
      grupoingles: sanitize(req.body.grupoingles),
      escolaridad: sanitize(req.body.escolaridad),
      id_campus: parseInt(req.body.id_campus),
      id_materia: parseInt(req.body.id_materia),
      idioma: sanitize(req.body.idioma)
    };

    await altaSchema.validate(body);

    const [results] = await pool.query(
      'CALL ommega.DocenteAltaGrupo(?,?,?,?,?,?,?,?)',
      [body.usuario, body.grado, body.grupo, body.grupoingles, body.escolaridad, body.id_campus, body.id_materia, body.idioma]
    );

    const datos = results?.[0] || [];

    response.mensaje = datos.length === 0
      ? 'No se insertó ningún registro'
      : 'Se insertó el grupo correctamente';
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
    console.error('[ERROR ALTA Grupo]', err.message);
    return res.status(500).send(response);
  }
});


router.post('/baja', async (req, res) => {
  const response = {
    error: false,
    codigo: 200,
    mensaje: '',
    datos: ''
  };

  try 
  {
    const body = 
    {
      usuario: sanitize(req.body.usuario),
      grupo: sanitize(req.body.grupo),
      grado: sanitize(req.body.grado),
      grupoingles: sanitize(req.body.grupoingles),
      escolaridad: sanitize(req.body.escolaridad)
    };

    await bajaSchema.validate(body);

    const [results] = await pool.query(
      'CALL ommega.DocenteBajaGrupo(?,?,?,?,?)',
      [body.usuario, body.grado, body.grupo, body.grupoingles, body.escolaridad]
    );

    const datos = results?.[0] || [];

    response.mensaje = datos.length === 0
      ? 'No se eliminó ningún registro'
      : 'Se dio de baja al grupo correctamente';
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
    console.error('[ERROR BAJA Grupo]', err.message);
    return res.status(500).send(response);
  }
});

module.exports = router;