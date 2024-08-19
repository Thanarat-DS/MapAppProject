import React from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

// parameter
const MergedLayer = ({ data, setHoveredFeature, setHoverPosition, onFeatureClick }) => {
    
    const onEachMergedLayerFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                setHoveredFeature({ properties: feature.properties, source: 'farm' });
                setHoverPosition({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
            },
            mouseout: () => {
                setHoveredFeature(null);
                setHoverPosition(null);
            },
            click: (e) => {
                e.originalEvent.stopPropagation();
                if (onFeatureClick) {
                    onFeatureClick(feature.properties["ลำดับแปลง"]);
                }
    
                // ตรวจสอบการใช้งาน classList หรือการ pan
                if (e.target && e.target.classList) {
                    // addClass หรือ panBy logic ของคุณที่นี่
                } else {
                    console.warn("Element หรือ classList ไม่พบ");
                }
            }
        });
    };
    
    

    return (
        <GeoJSON
            data={data}
            pointToLayer={(feature, latlng) => {
                let iconUrl = 'https://raw.githubusercontent.com/Thanarat-DS/MapAppProject/master/src/components/icon/groundwater.png';
                let iconSize = [75, 100];
                let iconAnchor = [13,40];

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
            }}
            onEachFeature={onEachMergedLayerFeature}
        />
    );
};

export default MergedLayer;
