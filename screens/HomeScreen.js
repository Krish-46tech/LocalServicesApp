import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '../data/categories';
import { filterServices } from '../data/helpers';
import { THEME } from '../constants/theme';
import { AppText } from '../components/AppText';
import { AnimatedSearchBar } from '../components/AnimatedSearchBar';
import { CategoryChip } from '../components/CategoryChip';
import { SectionHeader } from '../components/SectionHeader';
import { ServiceCard } from '../components/ServiceCard';
import { useServices } from '../context/ServicesContext';

export function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { services, loading, error, refresh, source, customLocation } = useServices();

  const filtered = useMemo(() => {
    return filterServices(services, { search, category: activeCategory });
  }, [activeCategory, search, services]);

  const featured = filtered.filter((item) => item.featured).slice(0, 8);
  const nearby = filtered.filter((item) => !item.featured).slice(0, 6);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + THEME.spacing.md }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={THEME.colors.primary} />}
    >
      <Animated.View entering={FadeInDown.duration(500)}>
        <AppText weight="bold" style={styles.title}>
          Find trusted local services
        </AppText>
        <AppText style={styles.subtitle}>Results are based on your real-time location.</AppText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(500)}>
        <AnimatedSearchBar value={search} onChangeText={setSearch} />
      </Animated.View>

      {!!error && <AppText style={styles.infoText}>{error}</AppText>}
      <AppText style={styles.sourceText}>
        {customLocation
          ? 'Showing results for your custom map location'
          : source === 'live'
          ? 'Live data source: OpenStreetMap'
          : 'Fallback data mode'}
      </AppText>

      <Animated.View entering={FadeInDown.delay(130).duration(500)} style={styles.section}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryChip
              label={item.label}
              active={activeCategory === item.id}
              onPress={() => setActiveCategory(item.id)}
            />
          )}
        />
      </Animated.View>

      <View style={styles.section}>
        <SectionHeader title="Featured" actionLabel="View all" onActionPress={() => navigation.navigate('Services')} />
        {loading && !services.length ? <ActivityIndicator color={THEME.colors.primary} /> : null}
        <FlatList
          data={featured}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInRight.delay(index * 90).duration(450)}>
              <ServiceCard service={item} onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })} />
            </Animated.View>
          )}
          ListEmptyComponent={<AppText style={styles.empty}>No featured services match this filter.</AppText>}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Nearby" />
        {nearby.map((service, index) => (
          <Animated.View key={service.id} entering={FadeInDown.delay(index * 100 + 140).duration(450)}>
            <ServiceCard
              horizontal
              service={service}
              onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
            />
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background
  },
  content: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.xxl,
    paddingBottom: 110
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    marginBottom: THEME.spacing.xs,
    textAlign: 'left'
  },
  subtitle: {
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.md,
    fontSize: 15,
    textAlign: 'left'
  },
  section: {
    marginBottom: THEME.spacing.xl
  },
  empty: {
    color: THEME.colors.textMuted,
    marginVertical: THEME.spacing.sm
  },
  infoText: {
    color: THEME.colors.warning,
    marginBottom: THEME.spacing.xs,
    textAlign: 'left'
  },
  sourceText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginBottom: THEME.spacing.md,
    textAlign: 'left'
  }
});
