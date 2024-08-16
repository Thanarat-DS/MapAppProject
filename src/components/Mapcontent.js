import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, GeoJSON, CircleMarker } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@changey/react-leaflet-markercluster/dist/styles.min.css';

// Path to the JSON file
import tambonChaiyapoom from './layers/database-json/Tambon/Tambon_ชัยภูมิ.json';
import tambonNakornlatsri from './layers/database-json/Tambon/Tambon_นครราชสีมา.json';
import tambonNakornsawan from './layers/database-json/Tambon/Tambon_นครสวรรค์.json';
import tambonPijit from './layers/database-json/Tambon/Tambon_พิจิตร.json';
import tambonPhetchabun from './layers/database-json/Tambon/Tambon_เพชรบูรณ์.json';
import tambonLopburi from './layers/database-json/Tambon/Tambon_ลพบุรี.json';
import data from './layers/database-json/output.json';
import groundwater_data from './layers/database-json/output_groundwater.json';

let FarmIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/Thanarat-DS/MapAppProject/master/src/components/icon/farm.png',
    iconSize: [75, 50],
    iconAnchor:[13,40],
});

let GroundWaterIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/Thanarat-DS/MapAppProject/master/src/components/icon/groundwater.png',
    iconSize: [75, 100],
    iconAnchor:[13,40],
});

L.Marker.prototype.options.icon = FarmIcon;

const Mapcontent = () => {
    const [position, setPosition] = useState(null);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const [hoverPosition, setHoverPosition] = useState(null);

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

        // return position === null ? null : (
        //     <Marker position={position}>
        //         <Popup>
        //             Are you here
        //         </Popup>
        //     </Marker>
        // );
    };

    const onEachFarmFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                setHoveredFeature({ properties: feature.properties, source: 'farm' });
                setHoverPosition({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
            },
            mouseout: () => {
                setHoveredFeature(null);
                setHoverPosition(null);
            }
        });
    };
    
    const onEachGroundwaterFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                setHoveredFeature({ properties: feature.properties, source: 'groundwater' });
                setHoverPosition({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
            },
            mouseout: () => {
                setHoveredFeature(null);
                setHoverPosition(null);
            }
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <MapContainer
                className="markercluster-map"
                preferCanvas={true}
                center={[13, 100]} // Center ตำแหน่งไทย
                zoom={5}
                maxZoom={19}
                style={{ height: "100vh" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkerClusterGroup>
                    <GeoJSON
                        data={data}
                        pointToLayer={(feature, latlng) => {
                            return L.marker(latlng, { icon: FarmIcon });
                        }}
                        onEachFeature={onEachFarmFeature}
                    />
                    <GeoJSON
                        data={groundwater_data}
                        pointToLayer={(feature, latlng) => {
                            return L.marker(latlng, { icon: GroundWaterIcon });
                        }}
                        onEachFeature={onEachGroundwaterFeature}
                    />
                </MarkerClusterGroup>

                {/* แสดง Polygon จาก GeoJSON */}
                {showChaiyapoom && (
                    <GeoJSON data={tambonChaiyapoom} style={{ color: 'blue' , weight: 0.9}} />
                )}
                {showNakornlatsri && (
                    <GeoJSON data={tambonNakornlatsri} style={{ color: 'green' , weight: 0.9}} />
                )}
                {showNakornsawan && (
                    <GeoJSON data={tambonNakornsawan} style={{ color: 'red' , weight: 0.9}} />
                )}
                {showPijit && (
                    <GeoJSON data={tambonPijit} style={{ color: 'purple' , weight: 0.9}} />
                )}
                {showPhetchabun && (
                    <GeoJSON data={tambonPhetchabun} style={{ color: 'orange' , weight: 0.9}} />
                )}
                {showLopburi && (
                    <GeoJSON data={tambonLopburi} style={{ color: 'yellow' , weight: 0.9}} />
                )}

                {hoveredFeature && hoverPosition && (
                    <div
                        style={{
                            position: 'absolute',
                            top: hoverPosition.y + 15,
                            left: hoverPosition.x + 15,
                            zIndex: 1000,
                            backgroundColor: 'white',
                            padding: '10px',
                            border: '1px solid black'
                        }}
                    >
                        <h4>
                            {hoveredFeature.source === 'groundwater' ? 'บ่อบาดาล' : 'แปลงไร่'}:
                        </h4>
                        <table>
                            <tbody>
                                {Object.entries(hoveredFeature.properties).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

            </div>
        </div>
    );
};

export default Mapcontent;
