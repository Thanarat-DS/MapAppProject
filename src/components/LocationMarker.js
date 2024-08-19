import { useMapEvents } from 'react-leaflet';

const LocationMarker = ({ setPosition, findGroundwatersWithinDistance, setGeoJsonData }) => {
    
    useMapEvents({
        click(e) {
            const latlng = e.latlng;
            setPosition(latlng);

            const nearbyGroundwaters = findGroundwatersWithinDistance(latlng.lat, latlng.lng);

            if (nearbyGroundwaters.length > 0) {
                const geoJson = {
                    type: "FeatureCollection",
                    features: nearbyGroundwaters
                };
                setGeoJsonData(geoJson);
                console.log('Nearby Groundwaters GeoJSON:', JSON.stringify(geoJson));
            } else {
                console.log('No groundwater found within 2km');
            }
        }
    });

    return null; 
};

export default LocationMarker;

// Backup Code
    // const LocationMarker = () => {
    //     const map = useMapEvents({
    //         click(e) {
    //             const latlng = e.latlng;

    //             setPosition(latlng);

    //             const geoJson = {
    //                 type: "FeatureCollection",
    //                 features: [
    //                     {
    //                         type: "Feature",
    //                         geometry: {
    //                             type: "Point",
    //                             coordinates: [latlng.lng, latlng.lat]
    //                         },
    //                         properties: {
    //                             description: "Clicked Location"
    //                         }
    //                     }
    //                 ]
    //             };
    //             setGeoJsonData(geoJson);
    //             console.log('GeoJSON:', JSON.stringify(geoJson));
    //         }
    //     });

        // return position === null ? null : (
        //     <Marker position={position}>
        //         <Popup>
        //             Are you here
        //         </Popup>
        //     </Marker>
        // );
