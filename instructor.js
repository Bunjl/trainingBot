'use strict'
const config = require('./config');
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const tg = new Telegram.Telegram(config.token,{
	workers: 1
});

const trainingList  = config.trainingList;
const min = config.min;
const max = config.max; 
let typeOfTrainging;
let amount;
let type;
let maxHours;
let minHours;
let interval;

function randomizer(max, min){
	return Math.floor(Math.random()*max + min);
}

function appriciateSleep(){
	//time is counted from server so take that into account
	let time = new Date().getHours();
	if(time > 8 && time < 22){
		maxHours = 1000*60*4;
		minHours = 1000*60*1;
	}else{
		maxHours = 1000*60*10;
		minHours = 1000*60*10;
	}
	return [maxHours, minHours];
}
function sendMessageInterval(chatId){
	tg.api.sendMessage(chatId, determineTrainingType());
}

function determineInterval(){
	 interval = appriciateSleep();
	return randomizer(interval[0], interval[1]);  
}

function determineTrainingType(){
	 typeOfTrainging = trainingList[randomizer(trainingList.length,0)];
	if (typeOfTrainging === 'plank' || typeOfTrainging === 'wallsit'){
		// repetitions make little sense for such as plank
		amount = randomizer(max*2,min*2);
		type = 'seconds';
	}else{
		type = 'times';
		amount = randomizer(max,min);
	}

	return typeOfTrainging + ' for '+ amount +' '+ type;
}


class trainingController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    trainerHandler($) {
    	var chatId = $.chatId;
    	setInterval(function(){ sendMessageInterval(chatId) }, determineInterval());

    	$.sendMessage(determineTrainingType());

    }

    sendMessage($){
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

