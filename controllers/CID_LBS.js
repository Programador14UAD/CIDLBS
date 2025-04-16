const query = require("./query");
module.exports = function (app, tp, connection) {

    app.post("/api/lbs_CID/prueba",async(req,res) => {
        console.log(req.body.alumno);
        res.send(200);
    });

    app.route("/api/lbs_CID/InsertarUsuario").post(async function(req, res) 
    {
        
        let response = 
        {
            error: false,
            codigo: 200,
            mensaje: '',
            datos:''
        };
    
        const usuario = req.body.usuario;
        const nombre = req.body.nombre;
        const paterno = req.body.paterno;
        const materno = req.body.materno;
        const pass = req.body.pass;
        const tipo = req.body.tipo;
        const grado = req.body.grado;
        const grupo = req.body.grupo;
        const gradoIngles = req.body.gradoIngles;
        const grupoIngles = req.body.grupoIngles;
        const escolaridad = req.body.escolaridad;
        const id_campus = req.body.id_campus;
        const activo = req.body.activo;
        const eliminado = req.body.eliminado;
        if (!usuario) 
        {
            response.error = true;
            response.codigo = 400;
            response.mensaje = 'El parámetro "usuario" no se ha proporcionado';
            return res.status(400).send(response);
        }
    
        try 
        {
            const results = await query(
                "CALL ommega.Usuarios_Post(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
                [usuario, nombre, paterno, materno, pass, tipo, grado, grupo, gradoIngles, grupoIngles, escolaridad,id_campus, activo,eliminado]
            );
            const datos = results?.[0];
            if (!datos || datos.length === 0) 
            {
                response.mensaje = 'No existe el usuario';
            } 
            else
            {
                response.mensaje = 'Se han realizado las acciones correspondientes al usuario';
                response.datos = datos;
            }
    
            return res.status(200).send(response);
        } 
        catch (err)
        {
            response.error = true;
            response.codigo = 500;
            response.mensaje = 'Error al ejecutar el procedimiento almacenado: ' + err.message;
            return res.status(500).send(response);
        }
    });
    
    app.route("/api/lbs_CID/ModificarEstadoUsuarios").post(async function(req, res) 
    {
        let response = 
        {
            error: false,
            codigo: 200,
            mensaje: '',
            datos:''
        };
        const usuario = req.body.usuario;
        const pass = req.body.pass;
        const activo = req.body.activo;
        

        if (!usuario) 
        {
            response.error = true;
            response.codigo = 400;
            response.mensaje = 'El parámetro "usuario" no se ha proporcionado';
            return res.status(400).send(response);
        }

        try
        {
            const results = await query(
                "CALL ommega.Usuarios_ModificarEstatus(?,?,?)", 
                [usuario,  pass,  activo]    
            );
            const datos = results?.[0];
            if (!datos || datos.length === 0) 
            {
                response.mensaje = 'No existe el usuario';
            } 
            else 
            {
                response.mensaje = 'Se ha actualizado el estado del usuario';
                response.datos = datos;
            }
    
            return res.status(200).send(response);
        }
        catch(err)
        {
            response.error = true;
            response.codigo = 500;
            response.mensaje = 'Error al ejecutar el procedimiento almacenado: ' + err.message;
            return res.status(500).send(response);
        }
    });

    app.route("/api/lbs_CID/AltaMaestrosGrupos").post(async function(req, res) 
    {
        let response = 
        {
            error: false,
            codigo: 200,
            mensaje: '',
            datos:''
        };
        const usuario = req.body.usuario;
        const grupo = req.body.grupo;
        const grado = req.body.grado;
        const grupoingles = req.body.grupoingles;
        const escolaridad = req.body.escolaridad;
        const id_campus = req.body.id_campus;
        const id_materia = req.body.id_materia;
        const Idioma = req.body.idioma;
        

        if (!usuario) 
        {
            response.error = true;
            response.codigo = 400;
            response.mensaje = 'El parámetro "usuario" no se ha proporcionado';
            return res.status(400).send(response);
        }

        try
        {
            const results = await query(
                "CALL ommega.DocenteAltaGrupo(?,?,?,?,?,?,?,?)", 
                [usuario,  grado,  grupo, grupoingles, escolaridad, id_campus, id_materia, id_campus,idioma]    
            );
            const datos = results?.[0];
            if (!datos || datos.length === 0) 
            {
                response.mensaje = 'No existe el usuario';
            } 
            else 
            {
                response.mensaje = 'Se ha actualizado el estado del usuario';
                response.datos = datos;
            }
    
            return res.status(200).send(response);
        }
        catch(err)
        {
            response.error = true;
            response.codigo = 500;
            response.mensaje = 'Error al ejecutar el procedimiento almacenado: ' + err.message;
            return res.status(500).send(response);
        }
    });

    app.route("/api/lbs_CID/BajaMaestrosGrupos").post(async function(req, res) 
    {
        let response = 
        {
            error: false,
            codigo: 200,
            mensaje: '',
            datos:''
        };
        const usuario = req.body.usuario;
        const grupo = req.body.grupo;
        const grado = req.body.grado;
        const grupoingles = req.body.grupoingles;
        const escolaridad = req.body.escolaridad;;
        

        if (!usuario) 
        {
            response.error = true;
            response.codigo = 400;
            response.mensaje = 'El parámetro "usuario" no se ha proporcionado';
            return res.status(400).send(response);
        }

        try
        {
            const results = await query(
                "CALL ommega.DocenteBajaGrupo(?,?,?,?,?)", 
                [usuario,  grado, grupo, grupoingles,escolaridad]    
            );
            const datos = results?.[0];
            if (!datos || datos.length === 0) 
            {
                response.mensaje = 'No existe el usuario';
            } 
            else 
            {
                response.mensaje = 'Se ha actualizado el estado del usuario';
                response.datos = datos;
            }
    
            return res.status(200).send(response);
        }
        catch(err)
        {
            response.error = true;
            response.codigo = 500;
            response.mensaje = 'Error al ejecutar el procedimiento almacenado: ' + err.message;
            return res.status(500).send(response);
        }
    });
};