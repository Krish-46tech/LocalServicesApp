import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export function useCurrentLocation() {
  const [region, setRegion] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Showing default city area.');
        setRegion({
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08
        });
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08
      });
      setError('');
    } catch (e) {
      setError('Could not fetch your location. Showing default area.');
      setRegion({
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { region, error, loading, refresh: fetchLocation };
}
