const socket = io();


if(navigator.geolocation){
    navigator.geolocation.watchPosition((pos)=>{
        const {latitude,longitude}=pos.coords;

        socket.emit("send-location",{latitude,longitude});
    },
(error)=>{
    console.error(error);
},{
    enableHighAccuracy:true,
    timeout:5000,
    maximumAge:0,
})
}

const map=L.map("map").setView([0,0],10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Dskumbhar",
}).addTo(map);

const marker={};

socket.on("receive-location",(data)=>{
    const {latitude,longitude,id} = data;
    map.setView([latitude,longitude],16);

    if(marker[id]){
        marker[id].setLatLng([latitude,longitude]);
    }else{
        marker[id]=L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnected",(id)=>{
    console.log(`user disconnected ${id}`);
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }
})
