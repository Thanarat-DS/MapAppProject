import React from 'react'
import { GeoJSON} from 'react-leaflet'
import data from './Data/output.json'

const Data = () => {
  return (
    <GeoJSON data={data}/>
  )
}

export default Data