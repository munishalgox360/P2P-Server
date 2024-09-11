// Convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
};

async function CalculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371000; // Radius of the Earth in meters
    
    const deltaLat = degreesToRadians(lat2 - lat1);
    const deltaLon = degreesToRadians(lon2 - lon1);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;    
    return Math.floor(distance);
};


module.exports = { CalculateDistance };

