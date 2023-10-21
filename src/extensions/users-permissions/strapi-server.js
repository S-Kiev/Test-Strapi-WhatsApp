let ultimateCode = '';
let validate = 0;
let user;


function generateCode() {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
 
    for (let i = 0; i < 3; i++) {
      code += Math.floor(Math.random() * 10);
    }
 
    for (let i = 0; i < 3; i++) {
      const index = Math.floor(Math.random() * letters.length);
      code += letters.charAt(index);
    }

    ultimateCode = code;
 
    return code;
  }

module.exports = (plugin) => {
  
    plugin.controllers.user.findByUsername = async (ctx) =>{

  //       if (!ctx.body.username || ctx.body.code != ultimateCode || ctx.body.validate < new Date().getTime()) {
    //        return ctx.response.status = 403;
      //  }   
      
      if (!ctx.request.params || !ctx.request.params.username) {
        return ctx.response.status = 400;
      }

      const username = ctx.request.params.username;
        
        ultimateCode  = '';
        validate = 0;

        user = await strapi.query('plugin::users-permissions.user').findOne({
             where: { username : username }
        }).then ((res)=>{
            try {
              if (res) {
                ctx.response.status = 200;
                ctx.response.body = { id: res.id };
            } else {
                ctx.response.status = 400;
                ctx.body = {
                  message: 'Usuario no encontrado'
                };
            }
            } catch (error){
              ctx.response.status = 400;
              ctx.body = error;
            }
    })
  }

  plugin.controllers.user.updateMyUser = async (ctx) => {

    if(!ctx.state.user || !ctx.state.user.id){
        ctx.response.status = 401;
    }

    await strapi.query('plugin::users-permissions.user').update({
        where : { id: ctx.state.user.id },
        data : ctx.request.body
    }).then((res) =>{
      ctx.response.status = 200;
    })
  }

  plugin.controllers.user.FindMyUser = async (ctx) => {
    if (!ctx.request.body.username || ctx.request.body.code !== '123') {
      ctx.response.status = 401;
      ctx.body = {
        message: 'Usuario o código incorrecto'
      };
    }
  
    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { username: ctx.request.body.username },
    }).then((res) => {
      ctx.response.status = 200;
      ctx.response.body = res;
    }).catch((error) => {
      // Manejar errores aquí
      console.error(error);
      ctx.response.status = 500;
      ctx.body = {
        message: 'Error interno del servidor'
      };
    });
  };

  plugin.controllers.user.testRoute = (ctx) => {
    ctx.body = {
      message: "Hello World!",
    };
  };

     function getCode () {
      ultimateCode = generateCode();
      validate = new Date().getTime() + 60 * 60 * 1000;
      return ultimateCode; 
    }
  

    plugin.routes['content-api'].routes.push(
      {
        method: 'GET',
        path: '/user/:username',
        handler: 'user.findByUsername',
        config: {
          prefix: '',
          policies: []
        }
      },
      {
        method: "GET",
        path: "/user/test-route",
        handler: "user.testRoute",
        config: {
          prefix: "",
        },
      },
      {
        method: "PUT",
        path: "/user/updateMyUser",
        handler: "user.updateMyUser",
        config: {
          prefix: "",
          policies: []
        },
      },
      {
        method: "POST",
        path: "/user/FindMyUser",
        handler: "user.FindMyUser",
        config: {
          prefix: "",
          policies: []
        },
      }
    )

    return plugin
}
