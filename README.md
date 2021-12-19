# My home temperature versus SMHI temperature data.

I’ve installed Thingsboard via Kubernetes and microk8s on a Vultr server based in Stockholm which is receiving data from a Esp32 microcontroller and a DHT22 temperature sensor.  That was a very long sentence in which to describe an IaaS (Infrastructure as a Service) IoT solution, which previously would have taken a long time to configure and at great personal expense. However after just four days Vultr’s server has cost me the grand total of 66 cents (USD) or almost 6 SEK.

But it’s not just the cost that makes this whole solution possible, it’s also how the whole IoT landscape has involved to enable me in a relatively short period of time to integrate a temperature sensor to an Esp32 microcontroller with inbuilt WIFI to send data to a hosted server, which also receives data using SMHI’s API to fetch the current weather data for a given GPS location.  Below is the architecture diagram for this solution.

![Untitled](My%20home%20temperature%20versus%20SMHI%20temperature%20data%2086b1c75de6e649a1812b5489f2fe22fd/Untitled.png)

# Hardware configuration:

### Dht22 and esp32:

A Dht22 sensor which can handle minus temperatures is connected via a bred board to a esp32 module using pin 21 for sensor data and the usual 3.3v and ground connections.  

A VULTR server has been rented in Stockholm in order to host ubuntu and microk8s and thingsboard.io. This is a 2 CPU machine with 2 gigabytes of ram and 60 gigabytes of storage.

The firewall has been configured to permit access for the TCP ports required to receive the data from the esp32 and also HTTP for the data from the webserver.

# Software configuration:

### My temperature data from dht22 sensor:

The Huzzah Feather ESP32 is running C++ code, which was written in the Arduino IDE and then configured to compile on the huzzah feather and downloaded via the USB port.  The code is using the following libraries to support WIFI, Things board and the DHT sensor.  Five separate parameters are required to configure this program.  Your networks SSID and its password. The IP address and port for TCP http and an access token generated within your Things board instance.  

Data is collected via the DHT library and then sent to Things board using the things board’s http library, simply by assigning the following attributes: ThingsBoardHttp tb(espClient, TOKEN, THINGSBOARD_SERVER, THINGSBOARD_PORT).  

- espClient ⇒ Wifi client connection
- TOKEN ⇒ Internally generated within Thingsboard
- Thingsboard server ⇒ IP address of your server
- Thingsboard port ⇒ Port forwarded address, which is found with the following command “microk8s kubectl get service -o wide”.

### Data from SMHI API:

I’ve created a weather app with React on my laptop by simply using “`npx create-react-app my-app`" in this case I chose “weather-app” and then “npm start” starts the webserver for you.

![Untitled](My%20home%20temperature%20versus%20SMHI%20temperature%20data%2086b1c75de6e649a1812b5489f2fe22fd/Untitled%201.png)

Webserver running in Chrome displays the following:

![Untitled](My%20home%20temperature%20versus%20SMHI%20temperature%20data%2086b1c75de6e649a1812b5489f2fe22fd/Untitled%202.png)

The react app fetches the data via SMHI’s API within the app.js code with the following line:

```jsx
componentDidMount() {
fetch("[https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/xx.xxx/lat/xx.xxx/data.json](https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/17.924/lat/59.287/data.json)")
.then(res => res.json())
.then(data => {
```

You can see that the link uses the standard longitude and latitude co-ordinates which can be found for example from google maps with a right click over the desired location.

![Untitled](My%20home%20temperature%20versus%20SMHI%20temperature%20data%2086b1c75de6e649a1812b5489f2fe22fd/Untitled%203.png)

### Posting data from webserver to Thingsboard:

I’ve written a java script function to post the temperature data to the thingsboard instance on my VULTR server. This is triggered when the temperature has changed my comparing the previous value.  This function also uses a fetch command to send the data with the POST command as follows:

```jsx
var url = '[http://xx.xx.xxx.xxx](http://xx.xx.xxx.xxx/):xxxxx/api/v1/xxxxxxxxxxxxxxxxxxxx/telemetry' // --header "Content-Type:application/json'
var data = {"smhiTemperature":temperature};
```

```jsx
fetch(url, {
method: 'POST',
body: JSON.stringify(data),
headers: {
'Content-Type': 'application/json'
},
redirect: 'follow'
})
.then(response => {
if (response.status === 200) {
console.log(response.text());
} else {
throw new Error('Something went wrong on api server!');
}
})
.catch(error => {
console.error(error);
});
previousTemp = temperature; // update previous temp with new temp.
}
```

# Comparing data my sensor and SMHI:

![Untitled](My%20home%20temperature%20versus%20SMHI%20temperature%20data%2086b1c75de6e649a1812b5489f2fe22fd/Untitled%204.png)

I started collecting data from the DHT22 and ESP32 at 1500 @19/12/21 and after approximately 7 minutes the sensor had acclimatized to the outdoor temperature as shown above as temperature versus SMHI’s temperature shown in yellow, which as almost the same values.

# Future Plans and distant locations:

I’ve looked through the incredible list of locations that SMHI provide on their website at [https://opendata.smhi.se/apidocs/metobs/demo.html](https://opendata.smhi.se/apidocs/metobs/demo.html).  This includes some remote islands like Utklippan about 44 km south, south east off the coast of Karlskrona. It would be interesting to compare SMHI data from other locations around Sweden’s coast line.

![Untitled](My%20home%20temperature%20versus%20SMHI%20temperature%20data%2086b1c75de6e649a1812b5489f2fe22fd/Untitled%205.png)

Additionally many more weather parameters can be collected from SMHI and stored for future analysis to examine trends in weather conditions.  My current VULTR server has 55GB of storage and the current installation of software and data collection has used 0.95 gigabytes of data so far. VULTR can provide up to 1600 gigabytes of storage for a monthly price of $640 the OS and Thingsboard community version are free of charge.  

Each message from my sensor is around 14 bytes depending on the temperature value so with every gigabyte is roughly 1 billion bytes thus giving just over 71 million messages per gigabyte. At a frequency of one message per minute or 1440 per day and 525,600 per year it would take around 135 years per gigabyte to store temperature data from my own sensor and around the same amount for data collected from SMHI.

Additional devices can be provisioned via Thingsboard to collect data from other location simply my adding more devices via the “Device” menu option and then generating a new access token per device to enable secure access to Thingsboard.

![Untitled](My%20home%20temperature%20versus%20SMHI%20temperature%20data%2086b1c75de6e649a1812b5489f2fe22fd/Untitled%206.png)

Access token can then copied from the device page with the button “Copy access token” :

![Untitled](My%20home%20temperature%20versus%20SMHI%20temperature%20data%2086b1c75de6e649a1812b5489f2fe22fd/Untitled%207.png)