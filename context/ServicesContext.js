import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SERVICES as MOCK_SERVICES } from '../data/services';
import { fetchNearbyLiveServices } from '../data/liveServices';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { addTrustSignals } from '../data/ai';

const ServicesContext = createContext(null);

export function ServicesProvider({ children }) {
  const { region, error: locationError, loading: locationLoading, refresh: refreshLocation } = useCurrentLocation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('live');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [customLocation, setCustomLocation] = useState(null);
  const requestIdRef = useRef(0);

  const activeRegion = useMemo(() => {
    if (!region && !customLocation) return null;
    const base = customLocation || region;
    return {
      latitude: base.latitude,
      longitude: base.longitude,
      latitudeDelta: base.latitudeDelta ?? 0.08,
      longitudeDelta: base.longitudeDelta ?? 0.08
    };
  }, [customLocation, region]);

  const fetchServicesForRegion = useCallback(async (targetRegion) => {
    if (!targetRegion) return;
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);
      const live = await fetchNearbyLiveServices(targetRegion.latitude, targetRegion.longitude);
      if (requestId !== requestIdRef.current) return;
      setServices(live.map((service) => addTrustSignals(service, 'live')));
      setSource('live');
      setError('');
      setLastUpdated(new Date());
    } catch (e) {
      if (requestId !== requestIdRef.current) return;
      setServices(MOCK_SERVICES.map((service) => addTrustSignals(service, 'fallback')));
      setSource('fallback');
      setError('Live nearby services are temporarily unavailable. Showing fallback providers.');
      setLastUpdated(new Date());
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchServicesForRegion(activeRegion);
  }, [activeRegion, fetchServicesForRegion]);

  const refresh = useCallback(async () => {
    if (customLocation) {
      await fetchServicesForRegion(customLocation);
      return;
    }
    await refreshLocation();
  }, [customLocation, fetchServicesForRegion, refreshLocation]);

  const applyCustomLocation = useCallback(
    (nextRegion) => {
      const resolved = {
        latitude: nextRegion.latitude,
        longitude: nextRegion.longitude,
        latitudeDelta: nextRegion.latitudeDelta ?? 0.08,
        longitudeDelta: nextRegion.longitudeDelta ?? 0.08
      };
      setCustomLocation(resolved);
    },
    []
  );

  const clearCustomLocation = useCallback(() => {
    setCustomLocation(null);
  }, []);

  const value = useMemo(
    () => ({
      services,
      loading: loading || locationLoading,
      error: error || locationError,
      source,
      region: activeRegion,
      deviceRegion: region,
      customLocation,
      lastUpdated,
      refresh,
      applyCustomLocation,
      clearCustomLocation
    }),
    [
      activeRegion,
      applyCustomLocation,
      clearCustomLocation,
      customLocation,
      error,
      lastUpdated,
      loading,
      locationError,
      locationLoading,
      refresh,
      region,
      services,
      source
    ]
  );

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export function useServices() {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error('useServices must be used within ServicesProvider');
  }

  return ctx;
}
