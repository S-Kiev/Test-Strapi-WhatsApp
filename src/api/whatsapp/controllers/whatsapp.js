'use strict';

/**
 * whatsapp controller
 */

const { getTextUser } = require('./utils/getTextUser');
const { createCoreController } = require('@strapi/strapi').factories;

const dotenv = require('dotenv');
dotenv.config();

const { processMessage } = require('./shared/processMessage');

module.exports = createCoreController('api::whatsapp.whatsapp', ({strapi}) => ({
    async verifyToken (ctx) {
        try {
            var accessToken = process.env.WHATSAPP_WEBHOOK_KEY;
            var token = ctx.request.query["hub.verify_token"];
            var challenge = ctx.request.query["hub.challenge"];
    
            console.log(ctx.request);
            console.log('------------------------------');

            console.log(accessToken);
            console.log('------------------------------');

            console.log(challenge);
            console.log('------------------------------');

            console.log(token);
            console.log('------------------------------');

    
            if (challenge != null && token != null && token == accessToken) {
                ctx.body = challenge;
            } else {
                ctx.status = 400;
            }
        } catch (error) {
            ctx.status = 400;
        }
    },
    async recivedMessage (ctx) {
        try {
            var entry = (ctx.body['entry'])[0];
            var changes = (entry['changes'])[0];
            var value = changes['value'];
            var messageObject = value['messages'];

            console.log(messageObject);
    
    
            if(typeof messageObject != 'undefined'){

                var messages = messageObject[0];
                var number = messages['from']; //Obtengo el numero del usuario
                var text = getTextUser(messages); // Aqui recibo el mensaje
    
                await processMessage(text, number);
                  
             }
            ctx.response.body = 'EVENT_RECEIVED';
        } catch (error) {
            ctx.response.body = 'EVENT_RECEIVED';;
        }
    }
    
}));