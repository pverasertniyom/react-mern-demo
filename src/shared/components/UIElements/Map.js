import { useRef, useEffect } from 'react';
import View from 'ol/View';
import Maps from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import './Map.css';

const Map = (props) => {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const { center, zoom } = props;

  useEffect(() => {
    if (!instanceRef.current) {
      instanceRef.current = new Maps({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([center.lng, center.lat]),
          zoom: zoom,
        }),
      });

      const vectorLayer = new VectorLayer();

      const vectorSource = new VectorSource();

      const marker = new Feature({
        geometry: new Point(fromLonLat([center.lng, center.lat])), // Marker coordinates
      });

      const style = new Style({
        image: new Icon({
          anchor: [0.5, 1], // Adjust icon position
          src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png', // URL for marker icon
        }),
      });

      marker.setStyle(style);
      vectorSource.addFeature(marker);
      vectorLayer.setSource(vectorSource);
      instanceRef.current.addLayer(vectorLayer);
    }
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
