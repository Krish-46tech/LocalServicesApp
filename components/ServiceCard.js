import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { ScalePressable } from './ScalePressable';
import { useAppTheme } from '../context/ThemeContext';

export function ServiceCard({ service, horizontal = false, onPress }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

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
            <Ionicons name="star" size={14} color={theme.colors.warning} />
            <AppText weight="medium" style={styles.rating}>
              {service.rating}
            </AppText>
            <AppText style={styles.dot}>•</AppText>
            <AppText style={styles.meta}>{service.distanceKm} km</AppText>
          </View>

          {!!service.trust && (
            <View style={styles.trustRow}>
              <Ionicons
                name={service.trust.flagged ? 'shield-outline' : 'shield-checkmark'}
                size={14}
                color={service.trust.flagged ? theme.colors.warning : theme.colors.success}
              />
              <AppText style={styles.trustText}>Trust {service.trust.score}/100</AppText>
            </View>
          )}
        </View>
      </View>
    </ScalePressable>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    wrapper: {
      width: 235,
      marginRight: theme.spacing.md
    },
    horizontal: {
      width: '100%',
      marginRight: 0,
      marginBottom: theme.spacing.md
    },
    card: {
      borderRadius: theme.radius.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      ...theme.shadow
    },
    image: {
      width: '100%',
      height: 132
    },
    imageHorizontal: {
      height: 160
    },
    content: {
      padding: theme.spacing.md,
      gap: theme.spacing.xs
    },
    name: {
      fontSize: 16,
      textAlign: 'left'
    },
    address: {
      fontSize: 12,
      color: theme.colors.textMuted,
      textAlign: 'left'
    },
    meta: {
      fontSize: 13,
      color: theme.colors.textMuted,
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
      marginHorizontal: theme.spacing.xs,
      color: theme.colors.textMuted
    },
    trustRow: {
      marginTop: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5
    },
    trustText: {
      fontSize: 12,
      color: theme.colors.textMuted
    }
  });
}
