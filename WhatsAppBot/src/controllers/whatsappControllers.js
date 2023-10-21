const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res) =>{
    try {
        var accessToken = process.env.WHATSAPP_WEBHOOK_KEY;
        var token = req.query["hub.verify_token"];
        var challenge = req.query["hub.challenge"];

        if (challenge != null && token != null && token == accessToken) {
            res.send(challenge);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(400).send();
    }
}

async function recivedMessage (req, res) {
    try {
        var entry = (req.body['entry'])[0];
        var changes = (entry['changes'])[0];
        var value = changes['value'];
        var messageObject = value['messages'];

        if(typeof messageObject != 'undefined'){
            var messages = messageObject[0];
            var number = messages['from']; //Obtengo el numero del usuario
            var text = getTextUser(messages); // Aqui recibo el mensaje

            if (text != '') {

                //await process.processMessage(text, number);
            } 
            /*
            else if (text == 'image') {
                var data = samples.sampleImage(number);
                whatsappService.sendMessageWhatsapp(data);
            }
            else if (text == 'video') {
                var data = samples.sampleVideo(number);
                whatsappService.sendMessageWhatsapp(data);
            }
            else if (text == 'audio') {
                var data = samples.sampleAudio(number);
                whatsappService.sendMessageWhatsapp(data);
            }
            else if (text == 'document') {
                var data = samples.sampleDocument(number);
                whatsappService.sendMessageWhatsapp(data);
            }
            else if (text == 'button') {
                var data = samples.sampleButtons(number);
                whatsappService.sendMessageWhatsapp(data);
            }
            else if (text == 'list') {
                var data = samples.sampleList(number);
                whatsappService.sendMessageWhatsapp(data);
            }
            else if (text == 'location') {
                var data = samples.sampleLocation(number);
                whatsappService.sendMessageWhatsapp(data);
            }
            else {
                var data = samples.sampleText('no entiendo', number);
                whatsappService.sendMessageWhatsapp(data); // Aqui constesto a Whatsapp
            }
            */
        }
        res.send('EVENT_RECEIVED');
    } catch (error) {
        res.send('EVENT_RECEIVED');
    }
}

function getTextUser(messages){
    var text = '';
    var typeMessage = messages['type'];
    if (typeMessage == 'text') {
        text = (messages['text'])['body'];
    }
    else if (typeMessage == 'interactive') {
        var interactiveObject = messages['interactive'];
        var typeInteractive = interactiveObject['type'];
        if (typeInteractive == 'button_reply'){
            text = (interactiveObject['button_reply'])['title'];
        }
        else if (typeInteractive == 'list_reply'){
            text = (interactiveObject['list_reply'])['title'];
        }
        else {
            console.log('no hubo mensaje');
        }
    }
    /*
    else if(typeMessage == 'audio'){
        // Llmar a Whisper para obtener la transcripcion
    }
    */
    else {
        console.log('no hubo mensaje');
    }
    return text;
}

module.exports = {
    verifyToken,
    recivedMessage
}