"use client";

import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, Navigation2 } from "lucide-react";

type RideStatus = "arriving" | "ongoing" | "completed";

type Props = {
  driverLocation: [number, number] | null;
  pickUpLocation: [number, number] | null;
  dropLocation: [number, number] | null;
  status?: RideStatus;
};

type BoundsPoint = [number, number];

function FitBounds({ points }: { points: BoundsPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    map.invalidateSize();

    if (points.length === 1) {
      map.setView(points[0], Math.max(map.getZoom(), 14), { animate: true });
      return;
    }

    map.fitBounds(points, {
      padding: [72, 72],
      maxZoom: 15,
      animate: true,
      duration: 1,
    });
  }, [points, map]);

  return null;
}

const pickUpIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;filter:drop-shadow(0 10px 24px rgba(0,0,0,0.18));font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="background:linear-gradient(135deg,#111827,#1f2937);color:#ffffff;padding:8px 18px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(8px);">Pickup Point</div><div style="width:3px;height:14px;background:linear-gradient(to bottom,#1f2937,#6b7280);opacity:0.8;border-radius:10px;"></div><div style="width:20px;height:20px;border-radius:50%;background:#111827;border:4px solid #ffffff;box-shadow:0 0 0 4px rgba(17,24,39,0.12),0 8px 18px rgba(0,0,0,0.20);position:relative;"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:#22c55e;"></div></div></div>`,
  className: "",
  iconSize: [120, 60],
  iconAnchor: [60, 60],
});

const dropIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;filter:drop-shadow(0 10px 24px rgba(0,0,0,0.18));font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="background:linear-gradient(135deg,#7c2d12,#ea580c);color:#ffffff;padding:8px 18px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(8px);">Drop Point</div><div style="width:3px;height:14px;background:linear-gradient(to bottom,#ea580c,#fdba74);opacity:0.8;border-radius:10px;"></div><div style="width:20px;height:20px;border-radius:50%;background:#ea580c;border:4px solid #ffffff;box-shadow:0 0 0 4px rgba(234,88,12,0.12),0 8px 18px rgba(0,0,0,0.20);position:relative;"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:#ffffff;"></div></div></div>`,
  className: "",
  iconSize: [160, 80],
  iconAnchor: [80, 72],
});

const driverIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;filter:drop-shadow(0 10px 24px rgba(0,0,0,0.18));font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="background:linear-gradient(135deg,#0ea5e9,#0369a1);color:#ffffff;padding:8px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,0.12),inset 0 1px 0 rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(8px);">Driver</div><div style="width:3px;height:14px;background:linear-gradient(to bottom,#0369a1,#0ea5e9);opacity:0.9;border-radius:10px;margin-top:4px"></div><div style="width:18px;height:18px;border-radius:50%;background:#0369a1;border:4px solid #ffffff;box-shadow:0 0 0 4px rgba(3,105,161,0.12),0 8px 18px rgba(0,0,0,0.18);position:relative;margin-top:6px"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:#fff;"></div></div></div>`,
  className: "",
  iconSize: [120, 64],
  iconAnchor: [60, 64],
});

const LiveRideMap = ({
  driverLocation,
  pickUpLocation,
  dropLocation,
  status = "ongoing",
}: Props) => {
  const [route, setRoute] = useState<BoundsPoint[]>([]);
  const [km, setKm] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const routeEndpoints =
    status === "arriving"
      ? driverLocation && pickUpLocation
        ? [driverLocation, pickUpLocation]
        : null
      : pickUpLocation && dropLocation
        ? [pickUpLocation, dropLocation]
        : null;

  const routeKey = routeEndpoints
    ? `${status}:${routeEndpoints[0][0]},${routeEndpoints[0][1]}:${routeEndpoints[1][0]},${routeEndpoints[1][1]}`
    : `${status}:none`;

  const loadRoute = async (
    a: BoundsPoint,
    b: BoundsPoint,
    signal: AbortSignal,
  ) => {
    try {
      const { data } = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`
      );

      if (signal.aborted) return;

      if (!data.routes?.length) return;

      const nextRoute = data.routes[0].geometry.coordinates.map(
        ([lon, lat]: [number, number]) => [lat, lon] as BoundsPoint,
      );

      setRoute([]);
      setRoute(nextRoute);

      const distKm = +(data.routes[0].distance / 1000).toFixed(2);
      setKm(distKm);
    } catch (err) {
      if (signal.aborted) return;

      console.error(err);
      setRoute([]);
      setKm(null);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (!routeEndpoints) {
      setRoute([]);
      setKm(null);
      setReady(true);
      return () => controller.abort();
    }

    setReady(false);

    const [start, end] = routeEndpoints;

    setRoute([]);
    setKm(null);

    void loadRoute(start, end, controller.signal).finally(() => {
      if (!controller.signal.aborted) {
        setReady(true);
      }
    });

    return () => {
      controller.abort();
    };
  }, [routeKey]);

  const fitPoints: BoundsPoint[] =
    route.length > 0
      ? route
      : routeEndpoints
        ? routeEndpoints
        : driverLocation
          ? [driverLocation]
          : [];

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={fitPoints[0] ?? driverLocation ?? [28.6139, 77.209]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {fitPoints.length > 0 && <FitBounds points={fitPoints} />}

        {pickUpLocation && <Marker position={pickUpLocation} icon={pickUpIcon} />}
        {dropLocation && <Marker position={dropLocation} icon={dropIcon} />}
        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon} />
        )}

        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={
              status === "arriving"
                ? {
                    color: "#ef4444",
                    weight: 4,
                    opacity: 0.95,
                    lineCap: "round",
                    lineJoin: "round",
                    dashArray: "2 8",
                  }
                : {
                    color: "#111827",
                    weight: 4,
                    opacity: 0.9,
                    lineCap: "round",
                    lineJoin: "round",
                  }
            }
          />
        )}
      </MapContainer>

      <AnimatePresence>
        {!ready && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-5"
            style={{ zIndex: 999 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-900"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border border-transparent border-t-zinc-300"
                />

                <div className="bg-white rounded-full p-2 shadow-sm">
                  <MapPin size={18} className="text-zinc-800" />
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-zinc-900">Loading your map</p>
                <p className="text-xs text-zinc-500">Plotting your best route...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ready && km !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-6 left-4 flex items-center gap-2 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl shadow-lg"
            style={{ zIndex: 500 }}
          >
            <Navigation2 size={13} className="text-zinc-900" />

            <span className="text-zinc-900 text-xs font-bold">{km} km</span>

            <span className="w-px h-3 bg-zinc-200" />

            <span>~{Math.max(3, Math.round((km / 25) * 60))} min</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveRideMap;