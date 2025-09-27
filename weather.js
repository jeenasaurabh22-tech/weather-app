base_URL="https://api.open-meteo.com/";
box=document.querySelector(".box");
let container=document.querySelector(".container");
let hourly=document.querySelectorAll(".hourly");
let temp=document.querySelectorAll(".temp");
let humidi=document.querySelectorAll(".humidi");
let windi=document.querySelectorAll(".windi");
const nextBtn=document.querySelector(".next-btn");
const btn=document.querySelector(".live-button");
let msg_humid=document.querySelector(".humid");
let msg_wind=document.querySelector(".wind");
let msg_temp=document.querySelector(".weather-update h1");
let lats=document.querySelector(".lati input");
let longs=document.querySelector(".long input");
let btn3=document.querySelector(".getnewlocation");
btn3.addEventListener("click",(evt)=>{
    evt.preventDefault();
    container.classList.remove("hide");
    container.classList.add("container");
    box.classList.add("hide");
    box.classList.remove("box");
})






btn.addEventListener("click", async (event)=>{
    event.preventDefault();
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


nextBtn.addEventListener("click",async (evt)=>{
    
    evt.preventDefault();
    container.classList.add("hide");
    box.classList.add("box");
    box.classList.remove("hideMore");

    let lati_input=document.querySelector(".lati input");
    latitude=lati_input.value;
let long_input=document.querySelector(".long input");
longitude=long_input.value;

const  URL=`${base_URL}/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m`
let response= await fetch(URL);
let data=await response.json();
for(let i=0;i<=12;i++){
    hourly[i].innerText=data.hourly.time[i];
}
for(let i=0;i<=12;i++){
    temp[i].innerText=data.hourly.temperature_2m[i];
}
for(let i=0;i<=12;i++){
    humidi[i].innerText=data.hourly.relative_humidity_2m
[i];
}
for(let i=0;i<=12;i++){
    windi[i].innerText=data.hourly.wind_speed_10m[i];
}

})
