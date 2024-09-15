import React from 'react';
import { GeoJSON } from 'react-leaflet';

const GWAVLayer = ({ data, setHoveredFeature, setHoverPosition }) => {
    const getRGBColor = (gwav) => {
        const colorMap = {
            'R4': 'rgb(238,105,105)',
            'R3': 'rgb(249,124,124)',
            'R2': 'rgb(253,170,170)',
            'R1': 'rgb(244,193,193)',
            'G4': 'rgb(127, 179, 118)',
            'G3': 'rgb(149, 194, 141)',
            'G2': 'rgb(168, 206, 162)',
            'G1': 'rgb(185, 216, 180)',
            'B4': 'rgb(120, 162, 204)',
            'B3': 'rgb(150, 185, 208)',
            'B2': 'rgb(174, 203, 214)',
            'B1': 'rgb(191, 212, 219)'
        };

        return colorMap[gwav] || 'rgb(255,255,255)';
    };

    const onEachDataLayerFeature = (feature, layer) => {
        if (feature.properties && feature.properties.GWAV) {
            const color = getRGBColor(feature.properties.GWAV);

            layer.setStyle({
                fillColor: color,
                fillOpacity: 0.9,  // ความโปร่งการเติมสี
                color: 'black',    // สีเส้นขอบ
                weight: 0.9        // ความกว้างเส้นขอบ
            });
        }

        // layer.on({
        //     mouseover: (e) => {
        //         setHoveredFeature({ properties: feature.properties });
        //         setHoverPosition({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
        //     },
        //     mouseout: () => {
        //         setHoveredFeature(null);
        //         setHoverPosition(null);
        //     }
        // });
    };

    return (
        <GeoJSON
            data={data}
            onEachFeature={onEachDataLayerFeature}
        />
    );
};

export default GWAVLayer;
