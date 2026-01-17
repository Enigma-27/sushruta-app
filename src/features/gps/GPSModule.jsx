import React, { useState, useEffect } from 'react';

const GPSModule = () => {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Check if Geolocation is supported
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    // 2. Request current position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Location permission denied or unavailable.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  return (
    <div className="p-6 animate-fade-in h-full flex flex-col">
      <h1 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <i className="ph-fill ph-map-pin text-red-500"></i> Live GPS Location
      </h1>

      {loading && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p>Acquiring Satellite Signal...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <i className="ph-bold ph-warning-circle text-xl"></i>
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {coords && (
        <>
          <div className="w-full flex-1 min-h-[400px] rounded-3xl overflow-hidden border border-slate-200 shadow-lg relative bg-slate-100 mb-4">
            <iframe
              title="Live Location Map"
              width="100%"
              height="100%"
              // Standard Google Maps Embed URL
              src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
              className="w-full h-full border-none"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <i className="ph-bold ph-crosshair"></i>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Coordinates</p>
                <p className="text-sm font-mono text-slate-700 font-semibold">
                  ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}
                </p>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span>Open in Google Maps</span>
              <i className="ph-bold ph-arrow-square-out"></i>
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default GPSModule;