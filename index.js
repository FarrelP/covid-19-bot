const Discord = require("discord.js");
const config = require("./config.json");
const request = require("request");
const moment = require("moment");
const client = new Discord.Client();

const prefix = "-";

client.on("message", async function(message) {
	if(message.author.bot) return;
	if(!message.content.startsWith(prefix)) return;

	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();

	if(command === "covid") {
		const selectedCountry = args[0];
		let dateTo = moment().format('YYYY-MM-DD');
		let dateFrom = moment().subtract(7,'d').format('YYYY-MM-DD');
		let parsedDateTo = dateTo + "T00:00:00.000Z";
		let parsedDateFrom = dateFrom + "T00:00:00.000Z";

		let paramsData = {
			"country" : selectedCountry,
			"dateFrom" : parsedDateFrom,
			"dateTo" : parsedDateTo
		};

		let covidData = await promise_get_data(paramsData);

		let tempConfirmed = 0;
		let tempActive = 0;
		let tempDeaths = 0;
		let tempRecovered = 0;

		for(index in covidData) {
			tempConfirmed += covidData[index].Confirmed;
			tempActive += covidData[index].Active;
			tempDeaths += covidData[index].Deaths;
			tempRecovered += covidData[index].Recovered;
		}

		let requestedData = {
			"fromDate" : dateTo,
			"toDate" : dateFrom,
			"totalConfirmed" : tempConfirmed,
			"totalActive" : tempActive,
			"totalRecovered" : tempRecovered,
			"totalDeaths" : tempDeaths,
		};

		let msgReply = `Here's the data about Covid-19 in ${selectedCountry.toUpperCase()} from ${requestedData.fromDate} to ${requestedData.toDate}`;
		msgReply += ` with Total Confirmed ${requestedData.totalConfirmed},`;
		msgReply += ` Total Active ${requestedData.totalActive},`;
		msgReply += ` Total Recovered ${requestedData.totalRecovered}`;
		msgReply += ` and Total Deaths ${requestedData.totalDeaths}`;

		message.reply(msgReply);
	}
	
	if(command === "ping") {
		const timeTaken = Date.now() - message.createdTimestamp;
		message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
	}

	if(command === "help") {
		message.reply("```# hello world \n\nThis is Covid-19 Bot, I will help you guys to track down covid-19 victims across the world.```");
	}
});

function promise_get_data(paramsData) {
	const options = {
		url: `https://api.covid19api.com/country/${paramsData.country}?from=${paramsData.dateFrom}&to=${paramsData.dateTo}`,
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Accept-Charset': 'utf-8',
			'User-Agent': 'PostmanRuntime/7.26.1'
		}
	};

	return new Promise(function(resolve, reject){
		request(options, async (error, response, body) => {
			if(error) throw (error);
			let data = JSON.parse(body);
			return resolve(data);
		});
    });
}

client.login(config.BOT_TOKEN);