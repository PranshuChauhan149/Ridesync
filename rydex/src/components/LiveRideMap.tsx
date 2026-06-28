"use client";

import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

type Props = {
  driverLocation: [number, number] | null;
  pickUpLocation: [number, number] | null;
  dropLocation: [number, number] | null;
  mapStatus: string;
  onStats?: (data: {
    distanceToPickUp: number;
    etaToPickUp: number;
    distanceToDrop: number;
    etaToDrop: number;
  }) => void;
};
const pickUpIcon = L.divIcon({
  html: `
    <div style="
      font-size:32px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,.25));
    ">
      📍
    </div>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const dropIcon = L.divIcon({
  html: `
    <div style="
      font-size:32px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,.25));
    ">
      🏁
    </div>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const driverIcon = L.divIcon({
  html: `
    <div
      style="
        width:42px;
        height:42px;
        background:#111827;
        border-radius:9999px;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:22px;
        box-shadow:0 4px 15px rgba(0,0,0,.3);
        border:2px solid white;
      "
    >
      🚕
    </div>
  `,
  className: "",
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

const LiveRideMap = ({
  driverLocation,
  pickUpLocation,
  dropLocation,
  mapStatus,
  onStats,
}: Props) => {
  const center = driverLocation ||
    pickUpLocation ||
    dropLocation || [28.6139, 77.209];

  const [routeToPickUp, setRouteToPickUp] = useState<[number, number][]>([]);
  const [routeTodrop, setRouteToDrop] = useState<[number, number][]>([]);
  const showPickMarker = mapStatus === "arriving";
  const showPickUpRoute = mapStatus === "arriving" && routeToPickUp.length > 0;
  const showDropRoute = mapStatus !== "completed" && routeTodrop.length > 0;
  useEffect(() => {
    if (!pickUpLocation || !dropLocation) return;
    if (mapStatus === "arriving" && !driverLocation) return;

    const [pLat, pLon] = pickUpLocation;
    const [dLat, dLon] = dropLocation;
    const [drLat, drLon] = driverLocation ?? [0, 0];

    const getRoute = async ({
      startLat,
      startLon,
      endLat,
      endLon,
    }: {
      startLat: number;
      startLon: number;
      endLat: number;
      endLon: number;
    }) => {
      const res = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`,
      );

      return res.data.routes?.[0] ?? null;
    };

    const fetchRoutes = async () => {
  try {
    if (mapStatus === "arriving") {
      const pickUpRoute = await getRoute({
        startLat: drLat,
        startLon: drLon,
        endLat: pLat,
        endLon: pLon,
      });

      const dropRoute = await getRoute({
        startLat: pLat,
        startLon: pLon,
        endLat: dLat,
        endLon: dLon,
      });

      if (pickUpRoute) {
        setRouteToPickUp(
          pickUpRoute.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          )
        );
      }

      if (dropRoute) {
        setRouteToDrop(
          dropRoute.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          )
        );
      }

      onStats?.({
        distanceToPickUp: (pickUpRoute?.distance ?? 0) / 1000,
        etaToPickUp: (pickUpRoute?.duration ?? 0) / 60,
        distanceToDrop: (dropRoute?.distance ?? 0) / 1000,
        etaToDrop: (dropRoute?.duration ?? 0) / 60,
      });
    } else if (mapStatus === "ongoing") {
      setRouteToPickUp([]);

      const dropRoute = await getRoute({
        startLat: drLat,
        startLon: drLon,
        endLat: dLat,
        endLon: dLon,
      });

      if (dropRoute) {
        setRouteToDrop(
          dropRoute.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          )
        );
      }

      onStats?.({
        distanceToPickUp: 0,
        etaToPickUp: 0,
        distanceToDrop: (dropRoute?.distance ?? 0) / 1000,
        etaToDrop: (dropRoute?.duration ?? 0) / 60,
      });
    } else {
      setRouteToPickUp([]);
      setRouteToDrop([]);

      onStats?.({
        distanceToPickUp: 0,
        etaToPickUp: 0,
        distanceToDrop: 0,
        etaToDrop: 0,
      });
    }
  } catch (error) {
    console.error("Failed to fetch routes:", error);
  }
};

    fetchRoutes();
  }, [driverLocation, pickUpLocation, dropLocation, mapStatus]);
  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={14}
        zoomControl={false}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {showPickMarker && pickUpLocation && (
          <Marker position={pickUpLocation} icon={pickUpIcon} />
        )}

        {dropLocation && <Marker position={dropLocation} icon={dropIcon} />}

        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon} />
        )}

        {showPickUpRoute && (
  <Polyline
    positions={routeToPickUp}
    pathOptions={{
      color: "#888",
      weight: 3,
      opacity: 0.9,
      dashArray: "3, 10",
      lineCap: "round",
      lineJoin: "round",
    }}
  />
)}

        {showDropRoute && (
          <Polyline
            positions={routeTodrop}
            pathOptions={{
              color: "#111827",
              weight: 4,
              opacity: 0.9,
              lineCap: "round",
              lineJoin: "round",
              dashArray: undefined,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveRideMap;
