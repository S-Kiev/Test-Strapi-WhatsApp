module.exports = {
    cambiarEstadoAlumnos : {
        //Maldito TypeScript
        task: async function ({strapi}){
            const alumnosACambiarEstado = await strapi.db.query('api::alumno.alumno').findMany({
                where : {
                    Activo : {
                        $eq: false 
                    }
                }
            });
            await Promise.all(alumnosACambiarEstado.map(alumno =>{
                return strapi.service('api::alumno.alumno').update(
                    alumno.id,
                    {
                        data : { Activo: true }
                    }
                )
            }))
        },
        options : {
            rule : '*/1 * * * *',
            tz: 'America/Montreal'
        }
    }
}