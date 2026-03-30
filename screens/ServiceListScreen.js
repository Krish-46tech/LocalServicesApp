import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '../data/categories';
import { filterServices, sortServices } from '../data/helpers';
import { THEME } from '../constants/theme';
import { AppText } from '../components/AppText';
import { CategoryChip } from '../components/CategoryChip';
import { AnimatedSearchBar } from '../components/AnimatedSearchBar';
import { ServiceCard } from '../components/ServiceCard';
import { useServices } from '../context/ServicesContext';

const SORT_OPTIONS = [
  { id: 'topRated', label: 'Top rated' },
  { id: 'nearest', label: 'Nearest' },
  { id: 'priceLow', label: 'Best value' }
];

export function ServiceListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('topRated');
  const { services, loading, error, refresh, lastUpdated, customLocation } = useServices();

  const listData = useMemo(() => {
    const filtered = filterServices(services, { search, category: activeCategory });
    return sortServices(filtered, activeSort);
  }, [activeCategory, activeSort, search, services]);

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + THEME.spacing.md }]}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={THEME.colors.primary} />}
        ListHeaderComponent={
          <View>
            <AppText weight="bold" style={styles.title}>
              Explore Services
            </AppText>
            <AppText style={styles.subTitle}>
              {customLocation
                ? 'Live providers near your selected map location.'
                : 'Live providers nearest to your current location.'}
            </AppText>
            <AnimatedSearchBar value={search} onChangeText={setSearch} placeholder="Search provider or category" />
            {!!error && <AppText style={styles.warning}>{error}</AppText>}
            {!!lastUpdated && (
              <AppText style={styles.updatedText}>Updated: {new Date(lastUpdated).toLocaleTimeString()}</AppText>
            )}

            <AppText weight="medium" style={styles.label}>
              Categories
            </AppText>
            <FlatList
              data={CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              style={styles.chipsRow}
              renderItem={({ item }) => (
                <CategoryChip
                  label={item.label}
                  active={item.id === activeCategory}
                  onPress={() => setActiveCategory(item.id)}
                />
              )}
            />

            <AppText weight="medium" style={styles.label}>
              Sort by
            </AppText>
            <FlatList
              data={SORT_OPTIONS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              style={styles.chipsRow}
              renderItem={({ item }) => (
                <CategoryChip
                  label={item.label}
                  active={item.id === activeSort}
                  onPress={() => setActiveSort(item.id)}
                />
              )}
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 55).duration(350)}>
            <ServiceCard
              horizontal
              service={item}
              onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
            />
          </Animated.View>
        )}
        ListEmptyComponent={<AppText style={styles.empty}>No services found for this filter.</AppText>}
      />
    </View>
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
    paddingBottom: 120
  },
  title: {
    fontSize: 28,
    marginBottom: THEME.spacing.xs,
    textAlign: 'left'
  },
  subTitle: {
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.md,
    textAlign: 'left'
  },
  label: {
    fontSize: 14,
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.xs,
    textAlign: 'left'
  },
  chipsRow: {
    marginBottom: THEME.spacing.md
  },
  empty: {
    marginTop: THEME.spacing.lg,
    color: THEME.colors.textMuted,
    textAlign: 'left'
  },
  warning: {
    color: THEME.colors.warning,
    marginBottom: THEME.spacing.xs,
    textAlign: 'left'
  },
  updatedText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginBottom: THEME.spacing.md,
    textAlign: 'left'
  }
});
