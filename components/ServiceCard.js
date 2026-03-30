import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { AppText } from './AppText';
import { ScalePressable } from './ScalePressable';

export function ServiceCard({ service, horizontal = false, onPress }) {
  return (
    <ScalePressable onPress={() => onPress?.(service)} style={[styles.wrapper, horizontal && styles.horizontal]}>
      <View style={styles.card}>
        <Image source={{ uri: service.image }} style={[styles.image, horizontal && styles.imageHorizontal]} />
        <View style={styles.content}>
          <AppText weight="bold" numberOfLines={1} style={styles.name}>
            {service.name}
          </AppText>
          {!!service.address && (
            <AppText numberOfLines={1} style={styles.address}>
              {service.address}
            </AppText>
          )}
          <AppText style={styles.meta}>{service.priceLabel}</AppText>
          <View style={styles.row}>
            <Ionicons name="star" size={14} color={THEME.colors.warning} />
            <AppText weight="medium" style={styles.rating}>
              {service.rating}
            </AppText>
            <AppText style={styles.dot}>•</AppText>
            <AppText style={styles.meta}>{service.distanceKm} km</AppText>
          </View>
        </View>
      </View>
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 235,
    marginRight: THEME.spacing.md
  },
  horizontal: {
    width: '100%',
    marginRight: 0,
    marginBottom: THEME.spacing.md
  },
  card: {
    borderRadius: THEME.radius.lg,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surface,
    ...THEME.shadow
  },
  image: {
    width: '100%',
    height: 132
  },
  imageHorizontal: {
    height: 160
  },
  content: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.xs
  },
  name: {
    fontSize: 16,
    textAlign: 'left'
  },
  address: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'left'
  },
  meta: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    textAlign: 'left'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rating: {
    marginLeft: 4,
    fontSize: 13
  },
  dot: {
    marginHorizontal: THEME.spacing.xs,
    color: THEME.colors.textMuted
  }
});
