let ultimateCode = '';
let validate = 0;
let user;


const bcrypt = require('bcrypt');
const { generateCode } = require('./generateCode');

module.exports = (plugin) => {

  plugin.controllers.user.sendCode = async (ctx) => {

    //Podria buscar y validar el numero de telefono cuando tenga la tabla infoUsuario

            if ( ctx.request.body.username || ctx.request.body.email ) {
                const user = await strapi.query('plugin::users-permissions.user').findOne({
                    where: {
                        $or: [
                        {
                            username: { $eqi : ctx.request.body.username },
                        },
                        {
                            email: { $eqi : ctx.request.body.email },
                        },
                        ],
                    },
                }).then((res)=>{
                    const code = generateCode();

                    //Validar Usuario
                    //Aqui si ya tengo el usuario y codigo guardar esos datos en una tabla junto con el manejo del tiempo para validez
                    //validate = new Date().getTime() + 60 * 60 * 1000;
    
                    //Aqui enviar el codigo por Whatsapp
                    ctx.response.status = 200;
                    ctx.response.body = {
                        message: `Operacion ejecutada correctamente`,
                        code : code,
                        user: res.password
                    };
                }).catch ((error)=>{
                    console.log(error);
                    ctx.response.status = 401;
                    ctx.body = {
                        message: `Usuario incorrecto`,
                    };
                });
                
                //Aqui buscar el numero de Usuario en la tabla infoUsuario

    } else {
        ctx.response.status = 401;
        ctx.body = {
        message: `Se requiere un numero, username, o email`
        };
    }
}



plugin.controllers.user.changePasswordByWhatsapp = async (ctx) => {

    //Buscar el codigo, y la validez desde-hasta, en la tabla 
    if(ctx.request.body.code == `1234`) {

        const password = bcrypt.hashSync(ctx.request.body.newPassword , 10);

        //logica de validacion de la nueva contraseña

        //Aqui busco al ususario viculado a ese codigo
        // a efectos de prueba que ctx me traiga el idUser
        await strapi.query('plugin::users-permissions.user').update({
            where: { id: ctx.request.body.id },
            data: { password },
        }).then((res)=>{
            ctx.response.status = 200;
            ctx.response.body = {
                message: `Operacion ejecutada correctamente`
            };
            /*
            ctx.response.status = 200;
            const jwt = await strapi.service("plugin::users-permissions.jwt").issue({
                id: res.id,
            });
            ctx.send({
                jwt,
                user: res,
            });
    */
        }).catch ((error)=>{
            console.log(error);
            ctx.response.status = 401;
            ctx.body = {
                message: `No se pudo actualizar al Usuario`,
            };
        }); 
    } else {
        ctx.response.status = 401;
        ctx.body = {
        message: `Se requiere un código valido`
        };
    }
}

  

    plugin.routes['content-api'].routes.push(
      {
        method: 'POST',
        path: '/user/sendCode',
        handler: 'user.sendCode',
        config: {
          prefix: '',
          policies: []
        }
      },
      {
        method: "PUT",
        path: "/user/changePasswordByWhatsapp",
        handler: "user.changePasswordByWhatsapp",
        config: {
          prefix: "",
          policies: []
        },
      }
    )

    return plugin
}
