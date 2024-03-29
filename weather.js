import axios from "axios"
import env from "dotenv"

env.config()

async function getWeather(req, res){
    try {
        let finalData = {}
        let initResponse = await axios.get(process.env.IP_URL)
        if (initResponse.data.status == `fail`){
            getWeather(req, res);
            return;
        }
        finalData["country"] = initResponse.data["country"];
        finalData["city"] = initResponse.data["city"];
        finalData["region"] = initResponse.data["regionName"];
        const weatherURL = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${initResponse.data["city"]}`
        const secondResponse = await axios.get(weatherURL);
        finalData["temp"] = secondResponse.data.current.temp_c;
        finalData["tempFeels"] = secondResponse.data.current.feelslike_c;
        finalData["humidity"] = secondResponse.data.current.humidity;
        finalData["wind"] = secondResponse.data.current.wind_kph;
        finalData["weather"] = secondResponse.data.current.condition.text;
        res.json(finalData)

    } catch (error) {
        console.log(error.message)
        getWeather(req, res);
    }

}

export { getWeather }