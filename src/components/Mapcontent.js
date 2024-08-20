import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, GeoJSON, CircleMarker } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@changey/react-leaflet-markercluster/dist/styles.min.css';

import FarmLayer from './layers/FarmLayer';
import GroundwaterLayer from './layers/GroundwaterLayer';
import MergedLayer from './layers/MergedLayer';
import LocationMarker from './LocationMarker';

// Path to the JSON file
import tambonChaiyapoom from './layers/database-json/Tambon/Tambon_ชัยภูมิ.json';
import tambonNakornlatsri from './layers/database-json/Tambon/Tambon_นครราชสีมา.json';
import tambonNakornsawan from './layers/database-json/Tambon/Tambon_นครสวรรค์.json';
import tambonPijit from './layers/database-json/Tambon/Tambon_พิจิตร.json';
import tambonPhetchabun from './layers/database-json/Tambon/Tambon_เพชรบูรณ์.json';
import tambonLopburi from './layers/database-json/Tambon/Tambon_ลพบุรี.json';
import farm_data from './layers/database-json/output.json';
import groundwater_data from './layers/database-json/output_groundwater.json';
import merged_data from './layers/database-json/merged_data.json';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(merged_data);
    const [plotNumbers, setPlotNumbers] = useState([]);

    const [showChaiyapoom, setShowChaiyapoom] = useState(true);
    const [showNakornlatsri, setShowNakornlatsri] = useState(true);
    const [showNakornsawan, setShowNakornsawan] = useState(true);
    const [showPijit, setShowPijit] = useState(true);
    const [showPhetchabun, setShowPhetchabun] = useState(true);
    const [showLopburi, setShowLopburi] = useState(true);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        console.log(value);
    
        if (value === '') {
            setFilteredData(merged_data);
        } else {
            const filteredFeatures = merged_data.features.filter((feature) => {
                return feature.properties["ลำดับแปลง"].toString() === value;
            });
    
            setFilteredData({
                ...merged_data,
                features: filteredFeatures,
            });
        }
    };
    
    

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    };

    const findGroundwatersWithinDistance = (lat, lng, distanceLimit = 2) => {
        const nearbyGroundwaters = groundwater_data.features.filter(feature => {
            const [groundLng, groundLat] = feature.geometry.coordinates;
            const distance = calculateDistance(lat, lng, groundLat, groundLng);
            return distance <= distanceLimit;
        });
        return nearbyGroundwaters;
    };

    // const handleMapClick = (e) => {
    //     if (e.target.tagName === 'CANVAS') {
    //         setFilteredData(merged_data); // รีเซ็ตข้อมูล
    //     }
    // };

    useEffect(() => {
        const uniquePlotNumbers = [
            ...new Set(
                merged_data.features.map(feature => feature.properties['ลำดับแปลง'])
            ),
        ];
        setPlotNumbers(uniquePlotNumbers);
    }, []);
    
    return (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', zIndex: 1000, transform: 'translateX(-50%)', textAlign: 'center', marginTop: '10px', left: '50%'}}>
                <input
                    type="text"
                    placeholder="ค้นหาลำดับแปลง"
                    list="plotNumbers"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ padding: '5px', width: '300px' }}
                />
                <datalist id="plotNumbers">
                    {plotNumbers.map(number => (
                        <option key={number} value={number}>
                            {number}
                    </option>
                ))}
                </datalist>
            </div>
            <MapContainer
                key={searchTerm} 
                className="markercluster-map"
                preferCanvas={true}
                center={[13, 100]} // Center ตำแหน่งไทย
                zoom={5}
                maxZoom={19}
                style={{ height: "100vh" }}
                onClick={() => setFilteredData(merged_data)}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkerClusterGroup disableClusteringAtZoom={15}>
                    <FarmLayer 
                        data={farm_data} 
                        findGroundwatersWithinDistance={findGroundwatersWithinDistance} 
                        GroundWaterIcon={L.icon({
                            iconUrl: 'https://raw.githubusercontent.com/Thanarat-DS/MapAppProject/master/src/components/icon/groundwater.png',
                            iconSize: [75, 100],
                            iconAnchor:[13,40],
                        })}
                        setHoveredFeature={setHoveredFeature}
                        setHoverPosition={setHoverPosition}
                    />
                    <GroundwaterLayer 
                        data={groundwater_data} 
                        setHoveredFeature={setHoveredFeature} 
                        setHoverPosition={setHoverPosition}
                    />
                    <MergedLayer 
                        data={filteredData} 
                        setHoveredFeature={setHoveredFeature} 
                        setHoverPosition={setHoverPosition}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ marginBottom: '5px', marginTop: '0px' }}>
                                {hoveredFeature.source === 'groundwater' ? 'บ่อบาดาล' : 'แปลงไร่'}:
                            </h4>
                            <button
                                onClick={() => {
                                    setHoveredFeature(null);
                                    setHoverPosition(null);
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    marginLeft: '10px',
                                    marginTop: '-7px',
                                    color: 'blue',
                                }}
                            >
                                x
                            </button>
                        </div>
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
                <LocationMarker 
                    setPosition={setPosition} 
                    findGroundwatersWithinDistance={findGroundwatersWithinDistance} 
                    setGeoJsonData={setGeoJsonData} 
                />

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
