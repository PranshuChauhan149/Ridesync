import React, { useEffect, useState } from 'react'
import L from "leaflet"
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import axios from 'axios'
import { AnimatePresence,motion } from 'motion/react'
import { MapPin, Navigation2 } from 'lucide-react'

type props = {
  pickUp: string,
  drop: string,
  onChange: (p: string, d: string) => void,
  onDistance: (d: number) => void
}

function FitBounds({
  p1,
  p2,
}: {
  p1: [number, number];
  p2: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    map.fitBounds([p1, p2], {
      padding: [72, 72],
      maxZoom: 15,
      animate: true,
      duration: 1
    });
  }, [p1, p2, map]);

  return null;
}



const pickUpIcon = new L.DivIcon({
  html: `
    <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      filter:drop-shadow(0 10px 24px rgba(0,0,0,0.18));
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    ">

      <!-- Top Label -->
      <div style="
        background:linear-gradient(135deg,#111827,#1f2937);
        color:#ffffff;
        padding:8px 18px;
        border-radius:999px;
        font-size:11px;
        font-weight:700;
        letter-spacing:0.12em;
        text-transform:uppercase;
        white-space:nowrap;
        box-shadow:
          0 8px 20px rgba(0,0,0,0.18),
          inset 0 1px 0 rgba(255,255,255,0.08);
        border:1px solid rgba(255,255,255,0.08);
        backdrop-filter:blur(8px);
      ">
        Pickup Point
      </div>

      <!-- Line -->
      <div style="
        width:3px;
        height:14px;
        background:linear-gradient(to bottom,#1f2937,#6b7280);
        opacity:0.8;
        border-radius:10px;
      "></div>

      <!-- Bottom Marker -->
      <div style="
        width:20px;
        height:20px;
        border-radius:50%;
        background:#111827;
        border:4px solid #ffffff;
        box-shadow:
          0 0 0 4px rgba(17,24,39,0.12),
          0 8px 18px rgba(0,0,0,0.20);
        position:relative;
      ">
        <div style="
          position:absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          width:6px;
          height:6px;
          border-radius:50%;
          background:#22c55e;
        "></div>
      </div>

    </div>
  `,
  className: "",
  iconSize: [120, 60],
  iconAnchor: [60, 60],
});

const dropIcon = new L.DivIcon({
  html: `
    <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      filter:drop-shadow(0 10px 24px rgba(0,0,0,0.18));
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    ">

      <!-- Top Label -->
      <div style="
        background:linear-gradient(135deg,#7c2d12,#ea580c);
        color:#ffffff;
        padding:8px 18px;
        border-radius:999px;
        font-size:11px;
        font-weight:700;
        letter-spacing:0.12em;
        text-transform:uppercase;
        white-space:nowrap;
        box-shadow:
          0 8px 20px rgba(0,0,0,0.18),
          inset 0 1px 0 rgba(255,255,255,0.08);
        border:1px solid rgba(255,255,255,0.08);
        backdrop-filter:blur(8px);
      ">
        Drop Point
      </div>

      <!-- Line -->
      <div style="
        width:3px;
        height:14px;
        background:linear-gradient(to bottom,#ea580c,#fdba74);
        opacity:0.8;
        border-radius:10px;
      "></div>

      <!-- Bottom Marker -->
      <div style="
        width:20px;
        height:20px;
        border-radius:50%;
        background:#ea580c;
        border:4px solid #ffffff;
        box-shadow:
          0 0 0 4px rgba(234,88,12,0.12),
          0 8px 18px rgba(0,0,0,0.20);
        position:relative;
      ">
        <div style="
          position:absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          width:6px;
          height:6px;
          border-radius:50%;
          background:#ffffff;
        "></div>
      </div>

    </div>
  `,
  className: "",
  iconSize: [160, 80],
  iconAnchor: [80, 72],
});

const SearchMap = ({ pickUp, drop, onChange, onDistance }: props) => {
  const [p1, setP1] = useState<[number, number]>();
  const [p2, setP2] = useState<[number, number]>();
  const [route,setRoute]=useState<[number,number][]>([]);
  const [km,setKm]=useState<number>(0);
  const [ready,setReady] = useState(false);
  const geoCoding = async (q: string): Promise<[number, number] | null> => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`
      );

      const [lon, lat] = data.features[0].geometry.coordinates;

      return [lat, lon];
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const reverseGeoCoding = async (lat: number, lon: number) => {
    const { data } = await axios.get(
      `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`
    );

    if (!data.features.length) return;

    const p = data.features[0].properties;

    return [p.name, p.street, p.city, p.state, p.country]
      .filter(Boolean)
      .join(", ");
  };

const loadRoute = async (
  p: [number, number],
  d: [number, number]
) => {
  try {
    const { data } = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`
    );

    if (!data.routes.length) return;

    setRoute(
      data.routes[0].geometry.coordinates.map(
        ([lon, lat]: number[]) => [lat, lon]
      )
    );

    const distKm = +(data.routes[0].distance / 1000).toFixed(2);

    setKm(distKm);
    onDistance(distKm);

  } catch (error) {
    console.error(error);
  }
};
  useEffect(() => {
    let active = true;

    const initializeRoute = async () => {
      if (!pickUp || !drop) {
        setP1(undefined);
        setP2(undefined);
        setRoute([]);
        setKm(0);
        onDistance(0);
        setReady(true);
        return;
      }

      setReady(false);

      const a = await geoCoding(pickUp);
      const b = await geoCoding(drop);

      if (!active) return;

      if (!a || !b) {
        setP1(undefined);
        setP2(undefined);
        setRoute([]);
        setKm(0);
        onDistance(0);
        setReady(true);
        return;
      }

      await loadRoute(a, b);
      if (!active) return;

      setP1(a);
      setP2(b);
      setReady(true);
    };

    initializeRoute();

    return () => {
      active = false;
    };
  }, [pickUp, drop]);


const dragPickUp = async (lat: number, lon: number) => {
  const addr =await reverseGeoCoding(lat,lon)
  setP1([lat, lon]);

  if (p2) {
    loadRoute([lat, lon], p2);
  }
  onChange(addr || pickUp, drop)
};

const dragDrop = async (lat: number, lon: number) => {
    const addr =await reverseGeoCoding(lat,lon)

  setP2([lat, lon]);

  if (p1) {
    loadRoute(p1, [lat, lon]);
  }
    onChange(pickUp, addr || drop)
};
  return (
    <div className='relative h-full w-full'>
      <MapContainer
        center={p1 ?? [28.6139, 77.2090]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {p1 && p2 && (
          <FitBounds
            p1={p1}
            p2={p2}
          />
        )}

       { p1 && <Marker position={p1} icon={pickUpIcon} draggable  eventHandlers={{
        dragend:e=>{
          const m=e.target.getLatLng()
          dragPickUp(m.lat,m.lng)
        }
       }} />}
       {p2 && <Marker position={p2} icon={dropIcon} draggable eventHandlers={{
        dragend:e=>{
          const m=e.target.getLatLng()
          dragDrop(m.lat,m.lng)
        }
       }} />}
           {route?.length > 0 && (
  <>
    <Polyline
      positions={route}
      pathOptions={{
        color: "#111827",
        weight: 4,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
        dashArray: undefined
      }}
    />
  </>
)}
      </MapContainer>

   <AnimatePresence>
  {!ready && (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="absolute inset-0 z-999 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-5"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-900"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-2 rounded-full border border-transparent border-t-zinc-300"
          />

          <div className="bg-white rounded-full p-2 shadow-sm">
            <MapPin size={18} className="text-zinc-800" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-zinc-900">
            Loading your map
          </p>

          <p className="text-xs text-zinc-500">
            Plotting your best route...
          </p>
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
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="absolute bottom-6 left-4 z-500 flex items-center gap-2 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl shadow-lg"
    >
      <Navigation2
        size={13}
        className="text-zinc-900"
      />

      <span className="text-zinc-900 text-xs font-bold">
        {km} km
      </span>

      <span className="w-px h-3 bg-zinc-200" />

      <span>
        ~{Math.max(3, Math.round((km / 25) * 60))} min
      </span>
    </motion.div>
  )}
</AnimatePresence>


    </div>
  );
};

export default SearchMap;