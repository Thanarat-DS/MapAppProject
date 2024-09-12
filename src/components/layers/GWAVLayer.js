import React from 'react';
import { GeoJSON } from 'react-leaflet';

const GWAVLayer = ({ data, setHoveredFeature, setHoverPosition }) => {
    
    const getColorFromGWAV = (GWAV) => {
        const getIntensity = (colorCode) => {
            const level = parseInt(colorCode[1]); // ดึงตัวเลขหลังตัวอักษร
            return Math.floor((level / 4) * 255); // คำนวณความเข้ม (0-255)
        };

        const r = GWAV.find(color => color.startsWith('R')) ? getIntensity(GWAV.find(color => color.startsWith('R'))) : 0;
        const g = GWAV.find(color => color.startsWith('G')) ? getIntensity(GWAV.find(color => color.startsWith('G'))) : 0;
        const b = GWAV.find(color => color.startsWith('B')) ? getIntensity(GWAV.find(color => color.startsWith('B'))) : 0;

        return `rgb(${r}, ${g}, ${b})`;
    };

    const onEachDataLayerFeature = (feature, layer) => {
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

    return (
        <GeoJSON
            data={data}
            onEachFeature={onEachDataLayerFeature}
        />
    );
};

export default GWAVLayer;
