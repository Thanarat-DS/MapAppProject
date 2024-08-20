import React from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

const MergedLayer = ({ data, setHoveredFeature, setHoverPosition }) => {

    const onEachMergedLayerFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                setHoveredFeature({ properties: feature.properties });
                setHoverPosition({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
            },
            mouseout: () => {
                setHoveredFeature(null);
                setHoverPosition(null);
            }
        });
    };

    const pointToLayer = (feature, latlng) => {
        let iconUrl = 'https://raw.githubusercontent.com/Thanarat-DS/MapAppProject/master/src/components/icon/groundwater.png';
        let iconSize = [75, 100];
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
            onEachFeature={onEachMergedLayerFeature}
        />
    );
};

export default MergedLayer;
