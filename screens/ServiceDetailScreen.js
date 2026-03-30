import React, { useMemo } from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { THEME } from '../constants/theme';
import { AppText } from '../components/AppText';
import { PrimaryButton } from '../components/PrimaryButton';
import { useServices } from '../context/ServicesContext';
import { SERVICES as MOCK_SERVICES } from '../data/services';

const HEADER_HEIGHT = 300;

export function ServiceDetailScreen({ route }) {
  const scrollY = useSharedValue(0);
  const { services, source } = useServices();
  const serviceId = route.params?.serviceId;

  const service = useMemo(() => {
    return services.find((item) => item.id === serviceId) || MOCK_SERVICES.find((item) => item.id === serviceId) || MOCK_SERVICES[0];
  }, [serviceId, services]);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-120, 0, 140], [1.4, 1, 1], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [-120, 0, 140], [-30, 0, 55], Extrapolation.CLAMP);
    return {
      transform: [{ scale }, { translateY }]
    };
  });

  const infoCardStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 60, 180], [1, 0.95, 0.85], Extrapolation.CLAMP)
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.heroWrap, imageAnimatedStyle]}>
          <Image source={{ uri: service.image }} style={styles.heroImage} />
        </Animated.View>

        <Animated.View style={[styles.infoCard, infoCardStyle]}>
          <AppText weight="bold" style={styles.title}>
            {service.name}
          </AppText>
          <AppText style={styles.liveText}>{source === 'live' ? 'Live listing from nearby area' : 'Fallback listing'}</AppText>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={16} color={THEME.colors.warning} />
            <AppText weight="medium" style={styles.metaText}>
              {service.rating}
            </AppText>
            <AppText style={styles.metaDot}>•</AppText>
            <AppText style={styles.metaText}>{service.reviews} reviews</AppText>
            <AppText style={styles.metaDot}>•</AppText>
            <AppText style={styles.metaText}>{service.distanceKm} km away</AppText>
          </View>
          <AppText style={styles.description}>{service.description}</AppText>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <AppText style={styles.statLabel}>Category</AppText>
              <AppText weight="bold" style={styles.statValue}>
                {service.category}
              </AppText>
            </View>
            <View style={styles.statItem}>
              <AppText style={styles.statLabel}>Pricing</AppText>
              <AppText weight="bold" style={styles.statValue}>
                {service.priceLabel}
              </AppText>
            </View>
            <View style={styles.statItem}>
              <AppText style={styles.statLabel}>Area</AppText>
              <AppText weight="bold" style={styles.statValue}>
                {service.city}
              </AppText>
            </View>
          </View>

          {!!service.address && <AppText style={styles.address}>{service.address}</AppText>}

          <PrimaryButton
            label="Call Now"
            onPress={() => Linking.openURL(`tel:${String(service.phone || '').replace(/[^\d+]/g, '')}`)}
            icon={<Ionicons name="call" size={18} color="#fff" />}
            style={styles.button}
          />
          <PrimaryButton
            label="Book Service"
            onPress={() => {}}
            icon={<Ionicons name="calendar" size={18} color="#fff" />}
            style={styles.button}
          />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background
  },
  content: {
    paddingBottom: 50
  },
  heroWrap: {
    height: HEADER_HEIGHT,
    overflow: 'hidden'
  },
  heroImage: {
    width: '100%',
    height: '100%'
  },
  infoCard: {
    marginTop: -30,
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg
  },
  title: {
    fontSize: 28,
    marginBottom: THEME.spacing.xs,
    textAlign: 'left'
  },
  liveText: {
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.sm,
    textAlign: 'left'
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: THEME.spacing.md
  },
  metaText: {
    color: THEME.colors.textMuted,
    fontSize: 14,
    marginLeft: 5,
    textAlign: 'left'
  },
  metaDot: {
    marginHorizontal: THEME.spacing.xs,
    color: THEME.colors.textMuted
  },
  description: {
    lineHeight: 22,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.lg,
    textAlign: 'left'
  },
  statRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md
  },
  statItem: {
    flex: 1,
    padding: THEME.spacing.sm,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
    ...THEME.shadow
  },
  statLabel: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'left'
  },
  statValue: {
    fontSize: 14,
    textTransform: 'capitalize',
    textAlign: 'left'
  },
  address: {
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.md,
    textAlign: 'left'
  },
  button: {
    marginBottom: THEME.spacing.sm
  }
});
