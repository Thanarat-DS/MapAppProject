import React from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

// parameter
const GroundwaterLayer = ({ data, setHoveredFeature, setHoverPosition }) => {
    
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
        <GeoJSON
            data={data}
            pointToLayer={(feature, latlng) => {
                return L.marker(latlng, { icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/Thanarat-DS/MapAppProject/master/src/components/icon/groundwater.png',
                    iconSize: [75, 100],
                    iconAnchor:[13,40],
                }) });
            }}
            onEachFeature={onEachGroundwaterFeature}
        />
    );
};

export default GroundwaterLayer;
