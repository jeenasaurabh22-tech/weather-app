base_URL="https://api.open-meteo.com/";
const btn=document.querySelector("button");
let msg_humid=document.querySelector(".humid");
let msg_wind=document.querySelector(".wind");
let msg_temp=document.querySelector(".weather-update h1");
btn.addEventListener("click", async (evt)=>{
    evt.preventDefault();
    let lati_input=document.querySelector(".lati input");
    latitude=lati_input.value;
let long_input=document.querySelector(".long input");
longitude=long_input.value;
const  URL=`${base_URL}/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m`
let response= await fetch(URL);
let data=await response.json();
console.log(data);
let temp=data.hourly.temperature_2m[0];
let humid=data.hourly.relative_humidity_2m[0];
let wind_speed=data.hourly.wind_speed_10m[0];
msg_temp.innerHTML=`<p>${temp}<sup>o</sup>C</p>`;
msg_humid.innerText=`${humid}% Humidity`;
msg_wind.innerText=`${wind_speed}Km/hr wind `;





})
