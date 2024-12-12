// Inicializar el mapa
const map = L.map('map').setView([40.416775, -3.703790], 13); // Coordenadas iniciales: Madrid

// Agregar la capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marcar la ubicación de la empresa
const empresaCoords = [40.416775, -3.703790]; // Coordenadas de la empresa
L.marker(empresaCoords)
    .addTo(map)
    .bindPopup('<b>Colegio Privado Ángel de la Guarda</b><br>Calle Ejemplo, 123, Ciudad, País')
    .openPopup();

// Calcular la ruta
document.getElementById('calculateRoute').addEventListener('click', () => {
    const clientLocation = document.getElementById('clientLocation').value;

    if (!clientLocation) {
        alert('Por favor, introduce tu ubicación.');
        return;
    }

    // Usar la API Nominatim para convertir la ubicación del cliente a coordenadas
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(clientLocation)}&format=json&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert('No se pudo encontrar la ubicación ingresada.');
                return;
            }

            const clientCoords = [data[0].lat, data[0].lon];

            // Trazar la ruta entre la ubicación del cliente y la empresa
            L.Routing.control({
                waypoints: [
                    L.latLng(clientCoords[0], clientCoords[1]),
                    L.latLng(empresaCoords[0], empresaCoords[1])
                ],
                routeWhileDragging: true,
                language: 'es'
            }).addTo(map);

            map.setView(clientCoords, 13); // Centrar el mapa en la ubicación del cliente
        })
        .catch(error => {
            alert('Ocurrió un error al buscar la ubicación.');
            console.error(error);
        });
});
