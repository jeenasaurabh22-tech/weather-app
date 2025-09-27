base_URL="https://api.open-meteo.com/";
live_URL="https://api.openweathermap.org/data/2.5/weather?";
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

const  URL=`${live_URL}lat=${latitude}&lon=${longitude}&appid=507380f421eff9044c3f63658e1f4fab`;
let response= await fetch(URL);
let data=await response.json();
console.log(data);
let temp=data.main.temp;
let humid=data.main.humidity;
let wind_speed=data.wind.speed;
temp-=273;
let t1=parseFloat(temp.toFixed(2));
msg_temp.innerHTML=`<p>${t1}<sup>o</sup>C</p>`;
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
console.log(data);
    const now = new Date();
  const currentHour = now.toISOString().slice(0, 13) + ":00"; 
  let index = data.hourly.time.indexOf(currentHour);
  
  let y=index;
  

    
for(let i=0;i<=12;i++){
    hourly[i].innerText=data.hourly.time[index++];
}

index=y;
for(let i=0;i<=12;i++){
    temp[i].innerText=data.hourly.temperature_2m[index++];
}
index=y;
for(let i=0;i<=12;i++){
    humidi[i].innerText=data.hourly.relative_humidity_2m
[index++];
}
index=y;
for(let i=0;i<=12;i++){
    windi[i].innerText=data.hourly.wind_speed_10m[index++];
}

})
