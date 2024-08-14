import React from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Data from './layers/Data';

const MarkerCluster = () => {
  return (
    <MarkerClusterGroup>
      <Data />
    </MarkerClusterGroup>
  );
};

export default MarkerCluster;
