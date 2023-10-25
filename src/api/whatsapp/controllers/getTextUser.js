function getTextUser (messages) {

    var text = '';
    var typeMessage = messages['type'];

    if (typeMessage == 'text') {
        text = (messages['text'])['body'];
    }
    else if(typeMessage == 'audio'){
        // Llmar a Whisper para obtener la transcripcion
    }
    else {
        console.log('tipode mensaje no valido');
    }
    return text;
}

module.exports = {
    getTextUser
}