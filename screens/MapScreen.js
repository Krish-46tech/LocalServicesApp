import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';
import { AppText } from '../components/AppText';
import { PrimaryButton } from '../components/PrimaryButton';
import { useServices } from '../context/ServicesContext';

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const {
    region,
    deviceRegion,
    services,
    loading,
    error,
    source,
    customLocation,
    applyCustomLocation,
    clearCustomLocation
  } = useServices();
  const [draftRegion, setDraftRegion] = useState(null);

  useEffect(() => {
    if (!draftRegion && region) {
      setDraftRegion(region);
    }
  }, [draftRegion, region]);

  useEffect(() => {
    if (customLocation) {
      setDraftRegion(customLocation);
      mapRef.current?.animateToRegion(customLocation, 350);
    }
  }, [customLocation]);

  const appliedRegion = customLocation || region;

  const hasPendingChanges = useMemo(() => {
    if (!appliedRegion || !draftRegion) return false;
    const latDiff = Math.abs(appliedRegion.latitude - draftRegion.latitude);
    const lonDiff = Math.abs(appliedRegion.longitude - draftRegion.longitude);
    return latDiff > 0.0008 || lonDiff > 0.0008;
  }, [appliedRegion, draftRegion]);

  if (loading && !region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <AppText style={styles.loadingText}>Getting map ready...</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        showsUserLocation
        onRegionChangeComplete={(nextRegion) => setDraftRegion(nextRegion)}
        onLongPress={(event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate;
          setDraftRegion({
            latitude,
            longitude,
            latitudeDelta: draftRegion?.latitudeDelta ?? appliedRegion?.latitudeDelta ?? 0.08,
            longitudeDelta: draftRegion?.longitudeDelta ?? appliedRegion?.longitudeDelta ?? 0.08
          });
        }}
      >
        {services.map((service) => (
          <Marker
            key={service.id}
            coordinate={service.location}
            title={service.name}
            description={`${service.category} • ${service.distanceKm} km`}
          />
        ))}

        {draftRegion ? (
          <Marker
            coordinate={{ latitude: draftRegion.latitude, longitude: draftRegion.longitude }}
            title={hasPendingChanges ? 'Draft search area' : 'Active search area'}
            description={hasPendingChanges ? 'Tap Apply Area to refresh services' : 'Services are fetched for this area'}
            pinColor={THEME.colors.primary}
          />
        ) : null}
      </MapView>

      <View style={[styles.overlayCard, { top: insets.top + 12 }]}>
        <View style={styles.overlayRow}>
          <Ionicons name="locate" size={18} color={THEME.colors.primary} />
          <AppText weight="bold">Choose area to discover services</AppText>
        </View>
        <AppText style={styles.sourceText}>
          {customLocation
            ? 'Custom location active'
            : source === 'live'
            ? 'Source: OpenStreetMap Overpass'
            : 'Source: Fallback data'}
        </AppText>
        {!!error && <AppText style={styles.errorText}>{error}</AppText>}
        <AppText style={styles.helperText}>Move map or long-press, then tap Apply Area.</AppText>

        <PrimaryButton
          label={loading ? 'Updating...' : 'Apply Area'}
          onPress={() => {
            if (!loading && draftRegion) {
              applyCustomLocation(draftRegion);
            }
          }}
          icon={<Ionicons name="search" size={18} color="#fff" />}
          style={styles.button}
          disabled={loading || !draftRegion || !hasPendingChanges}
        />

        {customLocation ? (
          <PrimaryButton
            label="Use My Current Location"
            onPress={() => {
              if (!loading) {
                clearCustomLocation();
                if (deviceRegion) {
                  setDraftRegion(deviceRegion);
                  mapRef.current?.animateToRegion(deviceRegion, 350);
                }
              }
            }}
            icon={<Ionicons name="locate" size={18} color="#fff" />}
            disabled={loading}
          />
        ) : null}

        {hasPendingChanges ? (
          <AppText style={styles.helperText}>Map moved. Tap Apply Area to refresh results.</AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background
  },
  loadingText: {
    marginTop: THEME.spacing.sm,
    color: THEME.colors.textMuted,
    textAlign: 'left'
  },
  overlayCard: {
    position: 'absolute',
    left: THEME.spacing.lg,
    right: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    ...THEME.shadow
  },
  overlayRow: {
    flexDirection: 'row',
    gap: THEME.spacing.xs,
    alignItems: 'center'
  },
  sourceText: {
    marginTop: THEME.spacing.xs,
    color: THEME.colors.textMuted,
    fontSize: 12,
    textAlign: 'left'
  },
  errorText: {
    marginTop: THEME.spacing.xs,
    color: THEME.colors.warning,
    fontSize: 13,
    textAlign: 'left'
  },
  helperText: {
    marginTop: THEME.spacing.xs,
    color: THEME.colors.textMuted,
    fontSize: 12,
    textAlign: 'left'
  },
  button: {
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs
  }
});
