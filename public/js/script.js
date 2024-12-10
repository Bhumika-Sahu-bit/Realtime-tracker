const socket = io();  //ishe socket initialise ho jatha hai or ishe connection request backend per jathi hai

// console.log("hey")
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
    (position) => {
        const { latitude , longitude } = position.coords;
        socket.emit("send-location" , { latitude , longitude});//with this we send a emit with frontend 
    },
    
    (error) => {
        console.error(error);
        alert(error)
    },
    {
        enableHighAccuracy: true,
        TIMEOUT: 5000,
        maximumAge: 0,
    }
    );
}

// L.map("map");
const map = L.map("map").setView([0,0], 16);
L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( map );
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "OpenStreetMap"
// }).addTo(map) //with this hum hamara map mil jayega all world ka

const markers = {};

socket.on("receive-location", (data,err) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude,longitude]);
    if(err){
        console.log(err)
    }
    else{
        console.log(data)
    }

    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});



socket.on("user-disconnected" , (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
