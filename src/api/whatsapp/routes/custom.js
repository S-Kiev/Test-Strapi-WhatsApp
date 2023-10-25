module.exports = {
    routes : [
        {
            method : 'GET',
            path: '/whatsapp',
            handler: 'whatsapp.verifyToken',
            config : {
                auth: false,
            }
        },
        {
            method : 'POST',
            path: '/whatsapp',
            handler: 'whatsapp.recivedMessage',
            config : {
                auth: false,
            }
        }
    ]
}