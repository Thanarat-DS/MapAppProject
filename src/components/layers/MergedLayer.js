import React, { useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { useMap } from 'react-leaflet';

const MergedLayer = ({ data, setHoveredFeature, setHoverPosition, hydrounit }) => {
    const map = useMap();
    useEffect(() => {
        if (data) {
            const bounds = L.geoJSON(data).getBounds();
            map.fitBounds(bounds, {
                padding: [50, 50], // เพิ่ม padding เพื่อให้ขอบเขตห่างจากขอบหน้าจอ
                maxZoom: 18        // กำหนดซูมสูงสุดให้ไม่ใกล้เกินไป
            });
        }
    }, [map, data]);
    

    const onEachMergedLayerFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                // คำนวณหาความสัมพันธ์ระหว่างจุดและ polygon เมื่อ hover
                const hydroProperties = hydrounit.features.find(polygon => 
                    booleanPointInPolygon(feature, polygon)
                )?.properties;

                // รวม properties ที่ต้องการแสดงจาก feature และ hydrounit
                const combinedProperties = {
                    ...feature.properties,
                    ...(hydroProperties ? {'ชั้นหินน้ำ': hydroProperties.DESCRIPT_T} : {})
                };

                setHoveredFeature({ properties: combinedProperties });
                setHoverPosition({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
            },
            mouseout: () => {
                setHoveredFeature(null);
                setHoverPosition(null);
            }
        });
    };

    const pointToLayer = (feature, latlng) => {
        let iconUrl = 'https://raw.githubusercontent.com/Thanarat-DS/MapAppProject/master/src/components/icon/well_icon2.png';
        let iconSize = [75, 80];
        let iconAnchor = [13, 40];

        if (feature.properties["แปลงไร่/บ่อน้ำบาดาล"] === "แปลงไร่") {
            iconUrl = 'https://raw.githubusercontent.com/Thanarat-DS/MapAppProject/master/src/components/icon/farm.png';
            iconSize = [75, 50];
        }

        return L.marker(latlng, { 
            icon: L.icon({
                iconUrl: iconUrl,
                iconSize: iconSize,
                iconAnchor: iconAnchor,
            }) 
        });
    };

    return (
        <GeoJSON
            data={data}
            pointToLayer={pointToLayer}
            onEachFeature={(feature, layer) => onEachMergedLayerFeature(feature, layer)}
        />
    );
};

export default MergedLayer;
