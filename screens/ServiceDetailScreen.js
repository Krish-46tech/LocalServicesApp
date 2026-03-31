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
import { AppText } from '../components/AppText';
import { PrimaryButton } from '../components/PrimaryButton';
import { useServices } from '../context/ServicesContext';
import { SERVICES as MOCK_SERVICES } from '../data/services';
import { useAppTheme } from '../context/ThemeContext';

const HEADER_HEIGHT = 300;

export function ServiceDetailScreen({ route }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
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

          {!!service.trust && (
            <View style={styles.trustPanel}>
              <View style={styles.trustHead}>
                <Ionicons
                  name={service.trust.flagged ? 'alert-circle' : 'shield-checkmark'}
                  size={16}
                  color={service.trust.flagged ? theme.colors.warning : theme.colors.success}
                />
                <AppText weight="medium">
                  {service.trust.level} ({service.trust.score}/100)
                </AppText>
              </View>
              {service.trust.reasons?.map((reason) => (
                <AppText key={reason} style={styles.trustReason}>
                  • {reason}
                </AppText>
              ))}
            </View>
          )}

          <View style={styles.metaRow}>
            <Ionicons name="star" size={16} color={theme.colors.warning} />
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
                {service.category.replace('_', ' ')}
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

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
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
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg
    },
    title: {
      fontSize: 28,
      marginBottom: theme.spacing.xs,
      textAlign: 'left'
    },
    liveText: {
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.sm,
      textAlign: 'left'
    },
    trustPanel: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.md
    },
    trustHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6
    },
    trustReason: {
      color: theme.colors.textMuted,
      fontSize: 12
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md
    },
    metaText: {
      color: theme.colors.textMuted,
      fontSize: 14,
      marginLeft: 5,
      textAlign: 'left'
    },
    metaDot: {
      marginHorizontal: theme.spacing.xs,
      color: theme.colors.textMuted
    },
    description: {
      lineHeight: 22,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      textAlign: 'left'
    },
    statRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md
    },
    statItem: {
      flex: 1,
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      ...theme.shadow
    },
    statLabel: {
      color: theme.colors.textMuted,
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
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
      textAlign: 'left'
    },
    button: {
      marginBottom: theme.spacing.sm
    }
  });
}
