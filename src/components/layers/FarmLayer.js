import React from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

// parameter
const FarmLayer = ({ data, findGroundwatersWithinDistance, GroundWaterIcon, setHoveredFeature, setHoverPosition }) => {
    
    const onEachFarmFeature = (feature, layer) => {
        layer.on({
            click: (e) => {
                const map = e.target._map;  // เข้าถึง map instance
                const { lat, lng } = e.latlng;
    
                map.flyTo([lat, lng], 14);  // ค่า zoom level อาจปรับได้ตามความเหมาะสม
    
                const nearbyGroundwaters = findGroundwatersWithinDistance(lat, lng);
    
                if (nearbyGroundwaters.length > 0) {
                    nearbyGroundwaters.forEach(groundwater => {
                        L.marker([groundwater.geometry.coordinates[1], groundwater.geometry.coordinates[0]], {
                            icon: GroundWaterIcon
                        }).addTo(e.target._map).bindPopup("Nearby Groundwater").openPopup();
                    });
                } else {
                    alert('No groundwater found within 2km');
                }
            },
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

    return (
        <GeoJSON
            data={data}
            pointToLayer={(feature, latlng) => {
                return L.marker(latlng, { icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/Thanarat-DS/MapAppProject/master/src/components/icon/farm.png',
                    iconSize: [75, 50],
                    iconAnchor:[13,40],
                }) });
            }}
            onEachFeature={onEachFarmFeature}
        />
    );
};

export default FarmLayer;

// Backup Code
    // const onEachFarmFeature = (feature, layer) => {
    //     layer.on({
    //         mouseover: (e) => {
    //             setHoveredFeature({ properties: feature.properties, source: 'farm' });
    //             setHoverPosition({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
    //         },
    //         mouseout: () => {
    //             setHoveredFeature(null);
    //             setHoverPosition(null);
    //         }
    //     });
    // };
