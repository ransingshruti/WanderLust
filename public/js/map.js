

console.log("MAP TOKEN:", mapToken);
console.log("LISTING OBJECT:", listing);

mapboxgl.accessToken = mapToken;

// Get coordinates from listing object
const coordinates = listing.geometry.coordinates;

// MAP
const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v11",
    center: coordinates,
    zoom: 9
});

// POPUP
const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`
        <h4>${listing.title}</h4>
        <p>${listing.location}</p>
        <b>Exact location will be provided after booking</b>
    `);

// MARKER
new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);


 

