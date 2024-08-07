import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { saveAs } from 'file-saver';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Mapcontent = () => {
    const [position, setPosition] = useState(null);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [jsonData, setJsonData] = useState(null); // เพิ่ม state สำหรับ JSON

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
                setJsonData(json);

                console.log('GeoJSON:', JSON.stringify(geoJson));
                console.log('JSON:', JSON.stringify(json));
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

    const saveGeoJson = () => {
        if (geoJsonData) {
            const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/json' });
            saveAs(blob, 'data.geojson');
        }
    };

    const saveJson = () => {
        if (jsonData) {
            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            saveAs(blob, 'data.json');
        }
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
                {jsonData && (
                    <textarea
                        readOnly
                        style={{ width: '300px', height: '100px', marginTop: '10px' }}
                        value={JSON.stringify(jsonData, null, 2)}
                    />
                )}
                <button onClick={saveGeoJson} disabled={!geoJsonData} style={{ display: 'block', marginTop: '10px' }}>
                    Save GeoJSON
                </button>
                <button onClick={saveJson} disabled={!jsonData} style={{ display: 'block', marginTop: '10px' }}>
                    Save JSON
                </button>
            </div>
        </div>
    );
};

export default Mapcontent;
