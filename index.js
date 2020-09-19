const Discord = require("discord.js");
const config = require("./config.json");
const request = require("request");
const client = new Discord.Client();

const prefix = "!";

client.on("message", async function(message) {
	if(message.author.bot) return;
	if(!message.content.startsWith(prefix)) return;

	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();

	if(command === "ping") {
		const timeTaken = Date.now() - message.createdTimestamp;
		message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
	}

	if(command === "covid") {
		var covidData = await promise_get_data();
		var country = covidData[0].Country; // Temporary variable
		var arrDate = [];

		for(index in covidData) {
			var date = covidData[index].Date;
			var formattedDate = await promise_date_formatting(date);
			
			arrDate.push(formattedDate);
		}

		var fromDate = arrDate[0];
		var toDate = arrDate[arrDate.length - 1];

		message.reply(`Here's the data from ${country} from ${fromDate} to ${toDate}`);
	}
});

function promise_get_data() {
	const options = {
		url: `https://api.covid19api.com/country/indonesia?from=2020-07-01T00:00:00Z&to=2020-07-03T00:00:00Z`,
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

function promise_date_formatting(data) {
	var date = new Date(data);
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var dt = date.getDate();

	if (dt < 10) {
	  dt = '0' + dt;
	}
	if (month < 10) {
	  month = '0' + month;
	}

	var result = year+'-' + month + '-'+dt;

	return new Promise(function(resolve, reject){
		return resolve(result);
    });
}

client.login(config.BOT_TOKEN);