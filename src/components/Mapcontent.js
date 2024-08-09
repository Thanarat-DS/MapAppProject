import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Path to the JSON file
import tambonChaiyapoom from './database-json/Tambon/Tambon_ชัยภูมิ.json';
import tambonNakornlatsri from './database-json/Tambon/Tambon_นครราชสีมา.json';
import tambonNakornsawan from './database-json/Tambon/Tambon_นครสวรรค์.json';
import tambonPijit from './database-json/Tambon/Tambon_พิจิตร.json';
import tambonPhetchabun from './database-json/Tambon/Tambon_เพชรบูรณ์.json';
import tambonLopburi from './database-json/Tambon/Tambon_ลพบุรี.json';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Mapcontent = () => {
    const [position, setPosition] = useState(null);
    const [geoJsonData, setGeoJsonData] = useState(null);

    const [showChaiyapoom, setShowChaiyapoom] = useState(true);
    const [showNakornlatsri, setShowNakornlatsri] = useState(true);
    const [showNakornsawan, setShowNakornsawan] = useState(true);
    const [showPijit, setShowPijit] = useState(true);
    const [showPhetchabun, setShowPhetchabun] = useState(true);
    const [showLopburi, setShowLopburi] = useState(true);

    const LocationMarker = () => {
        const map = useMapEvents({
            click(e) {
                const latlng = e.latlng;

                setPosition(latlng);

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

                {/* แสดง Polygon จาก GeoJSON */}
                {showChaiyapoom && (
                    <GeoJSON data={tambonChaiyapoom} style={{ color: 'blue' }} />
                )}
                {showNakornlatsri && (
                    <GeoJSON data={tambonNakornlatsri} style={{ color: 'green' }} />
                )}
                {showNakornsawan && (
                    <GeoJSON data={tambonNakornsawan} style={{ color: 'red' }} />
                )}
                {showPijit && (
                    <GeoJSON data={tambonPijit} style={{ color: 'purple' }} />
                )}
                {showPhetchabun && (
                    <GeoJSON data={tambonPhetchabun} style={{ color: 'orange' }} />
                )}
                {showLopburi && (
                    <GeoJSON data={tambonLopburi} style={{ color: 'yellow' }} />
                )}

                {/* Events */}
                <LocationMarker />
            </MapContainer>
            
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
                {/* Filter controls */}
                <div class="card"> 
                    <span class="title">จังหวัด</span><br></br>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={showChaiyapoom} 
                                onChange={() => setShowChaiyapoom(!showChaiyapoom)} 
                            />
                            ชัยภูมิ
                        </label>
                    </div>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={showNakornlatsri} 
                                onChange={() => setShowNakornlatsri(!showNakornlatsri)} 
                            />
                            นครราชสีมา
                        </label>
                    </div>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={showNakornsawan} 
                                onChange={() => setShowNakornsawan(!showNakornsawan)} 
                            />
                            นครสวรรค์
                        </label>
                    </div>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={showPijit} 
                                onChange={() => setShowPijit(!showPijit)} 
                            />
                            พิจิตร
                        </label>
                    </div>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={showPhetchabun} 
                                onChange={() => setShowPhetchabun(!showPhetchabun)} 
                            />
                            เพชรบูรณ์
                        </label>
                    </div>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={showLopburi} 
                                onChange={() => setShowLopburi(!showLopburi)} 
                            />
                            ลพบุรี
                        </label>
                    </div>
                </div>

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
