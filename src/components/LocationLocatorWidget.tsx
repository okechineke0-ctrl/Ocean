import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  X, 
  Compass, 
  Clock, 
  Phone, 
  Share2, 
  ExternalLink, 
  Copy, 
  Check, 
  Car, 
  Bus, 
  Footprints, 
  Building2, 
  Sparkles, 
  Layers, 
  Crosshair, 
  Info, 
  ChevronRight,
  Route,
  MessageCircle,
  ShieldCheck,
  Star,
  Map as MapIcon
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

// Coordinates for Agbani, Enugu State (ESUT / Agbani Central Corridor)
const HQ_COORDINATES = {
  lat: 6.3117,
  lng: 7.5518,
  latLabel: '6.3117° N',
  lngLabel: '7.5518° E',
  plusCode: '8F688H62+MC Agbani',
  fullAddress: 'Agbani Commercial & Technology Corridor, Near ESUT Main Gate, Agbani, Enugu State, Nigeria'
};

const LANDMARKS = [
  { name: 'ESUT Permanent Campus Gate', distance: '1.2 km', time: '3 min drive' },
  { name: 'Agbani Central Roundabout / Park', distance: '850 m', time: '2 min drive' },
  { name: 'First Bank / Access Bank Agbani', distance: '400 m', time: '1 min walk' },
  { name: 'Enugu Urban (Holy Ghost / Gariki)', distance: '28 km', time: '25 min drive' },
];

const TRANSIT_ROUTES = [
  {
    from: 'Enugu Central / Holy Ghost Park',
    type: 'Commercial Bus / Shuttle or Taxi',
    duration: '25 – 35 Mins',
    instructions: 'Board an Agbani/ESUT bus at Holy Ghost Park or Gariki Park. Alight at Agbani Roundabout or ESUT junction. Our tech office is right on the main commercial avenue.',
    icon: Bus,
    fare: '₦500 – ₦800'
  },
  {
    from: 'ESUT Main Campus / Student Area',
    type: 'Keke / Bike / Shuttle',
    duration: '3 – 5 Mins',
    instructions: 'Take a direct shuttle or tricycle from the school gate down to the Agbani banking corridor. Located in the modern commercial plaza.',
    icon: Footprints,
    fare: '₦100 – ₦200'
  },
  {
    from: 'Amechi / Gariki / Topland Axis',
    type: 'Drive / Direct Taxi',
    duration: '15 – 20 Mins',
    instructions: 'Take the Enugu-Agbani dual carriage expressway straight to Agbani town. Smooth paved road with dedicated parking in front of the building.',
    icon: Car,
    fare: 'Drive / Fuel'
  }
];

export const LocationLocatorWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'directions' | 'radar' | 'contact'>('map');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [copied, setCopied] = useState(false);
  
  // Geolocation & Live Distance State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserCoords({ lat: userLat, lng: userLng });
        const dist = calculateDistance(userLat, userLng, HQ_COORDINATES.lat, HQ_COORDINATES.lng);
        setDistanceKm(dist);
        setGeoLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoError('Unable to detect location. Please enable GPS permissions in your browser.');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${HQ_COORDINATES.lat}, ${HQ_COORDINATES.lng} (${HQ_COORDINATES.fullAddress})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareLocation = () => {
    const shareData = {
      title: 'Ocean Technologies Office Location',
      text: `Visit Ocean Technologies HQ in Agbani, Enugu State: ${HQ_COORDINATES.fullAddress}`,
      url: `https://www.google.com/maps/search/?api=1&query=${HQ_COORDINATES.lat},${HQ_COORDINATES.lng}`
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareData.url);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${HQ_COORDINATES.lat},${HQ_COORDINATES.lng}&destination_place_id=Agbani,+Enugu+State`;
  const googleMapsViewUrl = `https://www.google.com/maps/search/?api=1&query=${HQ_COORDINATES.lat},${HQ_COORDINATES.lng}`;

  return (
    <>
      {/* Google Maps Styled Floating Trigger Button */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-50 flex items-center gap-2.5">
        <button
          id="google-location-locator-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Google Location & Office Locator"
          className="group relative flex items-center gap-2 bg-white text-slate-800 p-2 sm:px-4 sm:py-2.5 rounded-full shadow-xl shadow-slate-900/15 border border-slate-200/80 hover:border-slate-300 hover:shadow-2xl active:scale-95 transition-all duration-200 focus:outline-hidden focus:ring-4 focus:ring-sky-200 cursor-pointer"
        >
          {/* Authentic Google Maps Pin Icon with Color Badge */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
            {/* Google Colors Indicator Rings */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 via-emerald-500 to-sky-500 opacity-70 group-hover:opacity-100 blur-[1px] transition-opacity" />
            <div className="relative w-full h-full rounded-full bg-white flex items-center justify-center">
              <div className="relative">
                <MapPin className="w-5 h-5 text-rose-600 fill-rose-600 drop-shadow-xs" />
                <span className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
            
            {/* Live Location Pulse */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div className="hidden sm:flex flex-col items-start text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded border border-rose-200/60 font-mono">
                Google Maps
              </span>
              <span className="text-[11px] font-bold text-slate-900 leading-tight">
                Agbani Office HQ
              </span>
            </div>
            <span className="text-[11px] text-slate-500 leading-tight">
              Get Live GPS & Directions
            </span>
          </div>
        </button>
      </div>

      {/* Google Maps Interactive Location Sheet */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-22 left-2 sm:left-6 z-50 w-[calc(100vw-1rem)] sm:w-[480px] max-h-[85vh] h-[640px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 font-sans">
          
          {/* Google Maps Search Bar Style Top Header */}
          <div className="bg-white p-3.5 border-b border-slate-200/80 shadow-xs z-10">
            <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2.5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-rose-600 fill-rose-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    Ocean Technologies HQ
                  </h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Agbani, Enugu State • Software Engineering Agency
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Rating & Status Bar */}
            <div className="flex items-center justify-between mt-2.5 px-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Open Now
                </span>
                <span className="text-slate-500 text-[11px] hidden sm:inline">
                  (Closes 7:00 PM WAT)
                </span>
              </div>
              <span className="text-slate-500 text-[11px] font-mono">
                ESUT Corridor
              </span>
            </div>
          </div>

          {/* Google Maps Quick Action Bar */}
          <div className="bg-slate-50/90 px-3 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions</span>
            </a>

            <a
              href={COMPANY_INFO.phoneTel}
              className="bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Office</span>
            </a>

            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={handleShareLocation}
              className="bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{shared ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-slate-200 bg-white text-xs font-semibold">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'map'
                  ? 'border-sky-600 text-sky-600 bg-sky-50/40'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map & Street</span>
            </button>

            <button
              onClick={() => setActiveTab('directions')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'directions'
                  ? 'border-sky-600 text-sky-600 bg-sky-50/40'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>Transit Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('radar')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'radar'
                  ? 'border-sky-600 text-sky-600 bg-sky-50/40'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Live Distance</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'contact'
                  ? 'border-sky-600 text-sky-600 bg-sky-50/40'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Office Info</span>
            </button>
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            
            {/* TAB 1: INTERACTIVE MAP & STREET OVERVIEW */}
            {activeTab === 'map' && (
              <div className="space-y-4">
                {/* Visual Map Embed / Satellite Container */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md h-52 group">
                  {/* Google Map Iframe for Agbani, Enugu */}
                  <iframe
                    title="Ocean Technologies Google Map"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15863.30560416805!2d7.5418!3d6.3117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1044bb7bb1507fbd%3A0x6a05ad2dc0910f5!2sAgbani%2C%20Enugu!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng`}
                    className="w-full h-full border-0 grayscale-[15%] contrast-[105%]"
                    loading="lazy"
                    allowFullScreen
                  />

                  {/* Floating Map Controls on Iframe */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-md text-[10px] font-semibold">
                    <a
                      href={googleMapsViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-sky-600" />
                      <span>Full Google Maps</span>
                    </a>
                  </div>

                  {/* Animated Office Location Pin Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 border border-slate-700/60 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <span className="font-bold block text-white text-[11px] leading-tight">Ocean Tech Plaza</span>
                      <span className="text-[10px] text-slate-300">Agbani Main Commercial Road</span>
                    </div>
                  </div>
                </div>

                {/* Exact Address & GPS Card */}
                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Physical Office Address</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                          {HQ_COORDINATES.fullAddress}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyCoords}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md flex items-center gap-1 font-medium transition-colors shrink-0 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 font-mono">
                      <span className="text-slate-400 text-[10px] block">GPS Latitude / Longitude</span>
                      <span className="text-slate-800 font-semibold">{HQ_COORDINATES.latLabel}, {HQ_COORDINATES.lngLabel}</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 font-mono">
                      <span className="text-slate-400 text-[10px] block">Google Plus Code</span>
                      <span className="text-sky-700 font-semibold">{HQ_COORDINATES.plusCode}</span>
                    </div>
                  </div>
                </div>

                {/* Prominent Nearby Landmarks */}
                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Nearby Landmarks in Agbani</span>
                  </h4>

                  <div className="divide-y divide-slate-100 text-xs">
                    {LANDMARKS.map((lm, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <span className="text-slate-700 font-medium">{lm.name}</span>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{lm.distance}</span>
                          <span className="text-emerald-700 font-semibold">{lm.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TRANSIT & STEP-BY-STEP DIRECTIONS */}
            {activeTab === 'directions' && (
              <div className="space-y-3">
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-xs text-sky-900 flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    Direct access via the newly paved <strong>Enugu–Agbani Dual Carriage Expressway</strong>. Fast & easily accessible from all parts of Enugu State.
                  </span>
                </div>

                <div className="space-y-3">
                  {TRANSIT_ROUTES.map((route, idx) => {
                    const IconComp = route.icon;
                    return (
                      <div key={idx} className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-slate-900">{route.from}</h4>
                              <span className="text-[10px] text-slate-500">{route.type}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-700 block">{route.duration}</span>
                            <span className="text-[10px] text-slate-400">Est: {route.fare}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {route.instructions}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Launch Google Navigation GPS</span>
                </a>
              </div>
            )}

            {/* TAB 3: LIVE GPS DISTANCE RADAR */}
            {activeTab === 'radar' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20 relative">
                    <Crosshair className={`w-8 h-8 ${geoLoading ? 'animate-spin' : ''}`} />
                    {userCoords && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Live Distance to Agbani Office
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Click below to allow your browser to calculate the exact distance and driving duration from your current location to our Agbani office.
                    </p>
                  </div>

                  {distanceKm !== null ? (
                    <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                        Estimated Distance
                      </span>
                      <div className="text-3xl font-extrabold text-sky-400 font-mono">
                        {distanceKm} <span className="text-base text-slate-300 font-sans">km away</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
                        <div className="bg-slate-800/80 p-2 rounded-lg text-center">
                          <Car className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                          <span className="text-[10px] text-slate-400 block">Est. Drive Time</span>
                          <span className="font-bold text-white">~{Math.max(3, Math.round(distanceKm * 1.3))} mins</span>
                        </div>
                        <div className="bg-slate-800/80 p-2 rounded-lg text-center">
                          <Bus className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                          <span className="text-[10px] text-slate-400 block">Transit Route</span>
                          <span className="font-bold text-white">Direct via Agbani Rd</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleDetectLocation}
                      disabled={geoLoading}
                      className="w-full py-3 bg-sky-600 hover:bg-sky-500 active:scale-98 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {geoLoading ? (
                        <>
                          <Crosshair className="w-4 h-4 animate-spin" />
                          <span>Acquiring GPS Satellites...</span>
                        </>
                      ) : (
                        <>
                          <Crosshair className="w-4 h-4" />
                          <span>Locate My Current Position</span>
                        </>
                      )}
                    </button>
                  )}

                  {geoError && (
                    <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
                      {geoError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: OFFICE CONTACT & VISITS */}
            {activeTab === 'contact' && (
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                    Operating Hours
                  </h4>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Monday – Friday</span>
                      <span className="font-semibold text-slate-900 font-mono">8:00 AM – 7:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Saturday</span>
                      <span className="font-semibold text-slate-900 font-mono">9:00 AM – 5:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Sunday</span>
                      <span className="text-amber-600 font-semibold">Emergency Support Only</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                    Direct Agbani Office Lines
                  </h4>

                  <div className="space-y-2">
                    <a
                      href={COMPANY_INFO.phoneTel}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold text-slate-800 block">{COMPANY_INFO.phoneFormatted}</span>
                          <span className="text-[10px] text-slate-500">Engr. Kechineke (Direct Line)</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </a>

                    <a
                      href={COMPANY_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold text-emerald-950 block">Instant WhatsApp Reception</span>
                          <span className="text-[10px] text-emerald-700">Quick project inquiry or office visit schedule</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-600" />
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-600">
                  <p>Walk-in consultations are welcome at our Agbani tech hub. Free WiFi and power available during project onboarding.</p>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Footer Action Capsule */}
          <div className="bg-white px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Agbani, Enugu State</span>
            </span>
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 hover:underline"
            >
              <span>Open in Google Maps App</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
