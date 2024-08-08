import React, { useState, useEffect  } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, GeoJSON} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { saveAs } from 'file-saver';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Path to the JSON file
import tambonLopburiJson from './database-json/Tambon/Tambon_ลพบุรี.json';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Mapcontent = () => {
    const [position, setPosition] = useState(null);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [polygonData, setPolygonData] = useState(null);

    useEffect(() => {
        // Load polygon data
        setPolygonData(tambonLopburiJson);
    }, []);

    const LocationMarker = () => {
        const map = useMapEvents({
            click(e) {
                const latlng = e.latlng;
                map.flyTo(latlng, 10); // ซูมเมื่อคลิก
                setPosition(latlng);

                // สร้าง GeoJSON จากตำแหน่ง
                const geoJson = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [latlng.lng, latlng.lat]
                            },
                            properties: {
                                description: "Clicked Location"
                            }
                        }
                    ]
                };
                setGeoJsonData(geoJson);

                // สร้าง JSON ธรรมดาจากตำแหน่ง
                const json = {
                    lat: latlng.lat,
                    lng: latlng.lng,
                    description: "Clicked Location"
                };

                console.log('GeoJSON:', JSON.stringify(geoJson));
            }
        });

        return position === null ? null : (
            <Marker position={position}>
                <Popup>
                    Are you here
                </Popup>
            </Marker>
        );
    };


    return (
        <div style={{ position: 'relative' }}>
            <MapContainer
                center={[13, 100]} // Center ตำแหน่งไทย
                zoom={5}
                style={{ height: "100vh" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[13, 100]}>
                    <Popup>
                        Test
                    </Popup>
                </Marker>

                {/* Events */}
                <LocationMarker />
            </MapContainer>
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
                {geoJsonData && (
                    <textarea
                        readOnly
                        style={{ width: '300px', height: '100px' }}
                        value={JSON.stringify(geoJsonData, null, 2)}
                    />
                )}

            </div>
        </div>
    );
};

export default Mapcontent;
