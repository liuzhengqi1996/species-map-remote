import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TrendChart } from "./TrendChart";

export default function SpeciesMap() {
  const [geoData, setGeoData] = useState(null);
  const [predData, setPredData] = useState({});
  const [monthIndex, setMonthIndex] = useState(0);
  const [months, setMonths] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  useEffect(() => {
    fetch("https://drive.google.com/uc?export=download&id=1-on4hxP0c6IhoaivQn2ql0L5mDqGv_9n")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
    fetch("https://drive.google.com/uc?export=download&id=1Sh9n9t-KkMS2L58AV-MoNYqYnUD7XU8_")
      .then((res) => res.json())
      .then((data) => {
        setPredData(data);
        setMonths(Object.keys(data[Object.keys(data)[0]]));
      });
  }, []);

  const getColor = (value: number) => {
    return value > 0.8
      ? "#800026"
      : value > 0.6
      ? "#BD0026"
      : value > 0.4
      ? "#E31A1C"
      : value > 0.2
      ? "#FC4E2A"
      : value > 0.05
      ? "#FD8D3C"
      : "#FFEDA0";
  };

  const styleFeature = (feature: any) => {
    const geoid = feature.properties.GEOID20;
    const month = months[monthIndex];
    const intensity = predData[geoid]?.[month] || 0;
    return {
      fillColor: getColor(intensity),
      weight: 0.5,
      color: "gray",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        setSelectedFeature({
          geoid: feature.properties.GEOID20,
          values: predData[feature.properties.GEOID20],
        });
      },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-2">Species Spread Prediction Map</h1>
      {months.length > 0 && (
        <>
          <input
            type="range"
            min={0}
            max={months.length - 1}
            value={monthIndex}
            onChange={(e) => setMonthIndex(Number(e.target.value))}
          />
          <p className="text-sm text-gray-700 mt-2">
            Showing: <strong>{months[monthIndex]}</strong>
          </p>
        </>
      )}
      <div className="h-[80vh] w-full">
        <MapContainer center=[40.5, -77] zoom={7} scrollWheelZoom style={ height: "100%", width: "100%" }>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geoData && months.length > 0 && (
            <GeoJSON data={geoData} style={styleFeature} onEachFeature={onEachFeature} />
          )}
        </MapContainer>
      </div>
      {selectedFeature && <TrendChart geoid={selectedFeature.geoid} values={selectedFeature.values} />}
    </div>
  );
}
