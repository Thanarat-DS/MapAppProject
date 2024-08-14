import React, { useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import tambonChaiyapoom from './database-json/Tambon/Tambon_ชัยภูมิ.json';
import tambonNakornlatsri from './database-json/Tambon/Tambon_นครราชสีมา.json';
import tambonNakornsawan from './database-json/Tambon/Tambon_นครสวรรค์.json';
import tambonPijit from './database-json/Tambon/Tambon_พิจิตร.json';
import tambonPhetchabun from './database-json/Tambon/Tambon_เพชรบูรณ์.json';
import tambonLopburi from './database-json/Tambon/Tambon_ลพบุรี.json';

const Province = () => {
  const [showChaiyapoom, setShowChaiyapoom] = useState(true);
  const [showNakornlatsri, setShowNakornlatsri] = useState(true);
  const [showNakornsawan, setShowNakornsawan] = useState(true);
  const [showPijit, setShowPijit] = useState(true);
  const [showPhetchabun, setShowPhetchabun] = useState(true);
  const [showLopburi, setShowLopburi] = useState(true);

  return (
    <div>
      {/* แสดง Polygon จาก GeoJSON */}
      {showChaiyapoom && (
        <GeoJSON data={tambonChaiyapoom} style={{ color: 'blue', weight: 0.9 }} />
      )}
      {showNakornlatsri && (
        <GeoJSON data={tambonNakornlatsri} style={{ color: 'green', weight: 0.9 }} />
      )}
      {showNakornsawan && (
        <GeoJSON data={tambonNakornsawan} style={{ color: 'red', weight: 0.9 }} />
      )}
      {showPijit && (
        <GeoJSON data={tambonPijit} style={{ color: 'purple', weight: 0.9 }} />
      )}
      {showPhetchabun && (
        <GeoJSON data={tambonPhetchabun} style={{ color: 'orange', weight: 0.9 }} />
      )}
      {showLopburi && (
        <GeoJSON data={tambonLopburi} style={{ color: 'yellow', weight: 0.9 }} />
      )}
    </div>
  );
};

export default Province;
