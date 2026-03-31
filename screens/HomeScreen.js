import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '../data/categories';
import { filterServices } from '../data/helpers';
import { classifyIssueToServiceAI } from '../data/ai';
import { AppText } from '../components/AppText';
import { AnimatedSearchBar } from '../components/AnimatedSearchBar';
import { CategoryChip } from '../components/CategoryChip';
import { SectionHeader } from '../components/SectionHeader';
import { ServiceCard } from '../components/ServiceCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useServices } from '../context/ServicesContext';
import { useAppTheme } from '../context/ThemeContext';

export function HomeScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [issueText, setIssueText] = useState('');
  const [classifierResult, setClassifierResult] = useState(null);
  const [classifierLoading, setClassifierLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const { services, loading, error, refresh, source, customLocation } = useServices();

  const filtered = useMemo(() => {
    return filterServices(services, { search, category: activeCategory });
  }, [activeCategory, search, services]);

  const featured = filtered.filter((item) => item.featured).slice(0, 8);
  const nearby = filtered.filter((item) => !item.featured).slice(0, 6);

  const runIssueClassifier = async () => {
    setClassifierLoading(true);
    try {
      const result = await classifyIssueToServiceAI(issueText);
      setClassifierResult(result);
      if (result.category && result.category !== 'all') {
        setActiveCategory(result.category);
      }
    } finally {
      setClassifierLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.md }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.colors.primary} />}
    >
      <Animated.View entering={FadeInDown.duration(500)}>
        <AppText weight="bold" style={styles.title}>
          Find trusted local services
        </AppText>
        <AppText style={styles.subtitle}>Results are based on your real-time or custom location.</AppText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(500)}>
        <AnimatedSearchBar value={search} onChangeText={setSearch} />
      </Animated.View>

      <View style={styles.issueWrap}>
        <AppText weight="medium" style={styles.issueLabel}>
          Describe your issue (AI Classifier)
        </AppText>
        <AnimatedSearchBar
          value={issueText}
          onChangeText={setIssueText}
          placeholder="Example: AC not cooling, need urgent repair"
        />
        <PrimaryButton
          label={classifierLoading ? 'Detecting...' : 'Detect Best Service'}
          onPress={runIssueClassifier}
          disabled={classifierLoading || !issueText.trim()}
        />
        {!!classifierResult && (
          <View style={styles.classifierCard}>
            <AppText weight="medium" style={styles.classifierLine}>
              Suggested: {classifierResult.category.replace('_', ' ')}
            </AppText>
            <AppText style={styles.classifierMeta}>
              Urgency: {classifierResult.urgency} | Confidence: {Math.round(classifierResult.confidence * 100)}%
            </AppText>
            <AppText style={styles.classifierMeta}>
              Source: {classifierResult.source === 'external_ai' ? 'External AI API' : 'Local fallback'}
            </AppText>
          </View>
        )}
      </View>

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
        {loading && !services.length ? <ActivityIndicator color={theme.colors.primary} /> : null}
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

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xxl,
      paddingBottom: 110
    },
    title: {
      fontSize: 30,
      lineHeight: 36,
      marginBottom: theme.spacing.xs,
      textAlign: 'left'
    },
    subtitle: {
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
      fontSize: 15,
      textAlign: 'left'
    },
    section: {
      marginBottom: theme.spacing.xl
    },
    issueWrap: {
      marginBottom: theme.spacing.md
    },
    issueLabel: {
      marginBottom: 6,
      textAlign: 'left'
    },
    classifierCard: {
      marginTop: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceMuted
    },
    classifierLine: {
      textTransform: 'capitalize'
    },
    classifierMeta: {
      marginTop: 4,
      color: theme.colors.textMuted,
      fontSize: 12
    },
    empty: {
      color: theme.colors.textMuted,
      marginVertical: theme.spacing.sm
    },
    infoText: {
      color: theme.colors.warning,
      marginBottom: theme.spacing.xs,
      textAlign: 'left'
    },
    sourceText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginBottom: theme.spacing.md,
      textAlign: 'left'
    }
  });
}
