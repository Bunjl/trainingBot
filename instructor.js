'use strict'
const config = require('./config');
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const tg = new Telegram.Telegram(config.token);

const trainingList  = config.trainingList;
let typeOfTrainging;
let amount;
let type;
const min = config.min;
const max = config.max; 

function determineTrainingType(){
	 typeOfTrainging = trainingList[Math.floor(Math.random()*trainingList.length)];
	if (typeOfTrainging === 'plank' || typeOfTrainging === 'wallsit'){
		// repetitions make little sense for such as plank
		amount = Math.floor(Math.random()*(max*2)+(min*2));
		type = 'seconds';
	}else{
		type = 'times';
		amount = Math.floor(Math.random()* max + min);
	}

	return typeOfTrainging + ' for '+ amount +' '+ type;
}

class trainingController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */

    trainerHandler($) {
        $.sendMessage(determineTrainingType());
    }

    get routes() {
        return {
            'start': 'trainerHandler'
        };
    }
}

tg.router
    .when( 
    	new TextCommand('start', 'start'),
    	new trainingController()
   	);

