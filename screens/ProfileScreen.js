import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';
import { AppText } from '../components/AppText';
import { ServiceCard } from '../components/ServiceCard';
import { useServices } from '../context/ServicesContext';

export function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { services } = useServices();
  const savedServices = services.slice(0, 3);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + THEME.spacing.md }]}
      data={savedServices}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <Animated.View entering={FadeInDown.duration(450)} style={styles.profileCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <AppText weight="bold" style={styles.name}>
                Krish
              </AppText>
              <AppText style={styles.email}>rawatkrish48@gmail.com</AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={THEME.colors.textMuted} />
          </Animated.View>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <AppText weight="bold" style={styles.metaValue}>
                {services.length}
              </AppText>
              <AppText style={styles.metaLabel}>Nearby</AppText>
            </View>
            <View style={styles.metaItem}>
              <AppText weight="bold" style={styles.metaValue}>
                {savedServices.length}
              </AppText>
              <AppText style={styles.metaLabel}>Saved</AppText>
            </View>
            <View style={styles.metaItem}>
              <AppText weight="bold" style={styles.metaValue}>
                Live
              </AppText>
              <AppText style={styles.metaLabel}>Mode</AppText>
            </View>
          </View>

          <AppText weight="bold" style={styles.sectionTitle}>
            Saved Services
          </AppText>
        </View>
      }
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
          <ServiceCard
            horizontal
            service={item}
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
          />
        </Animated.View>
      )}
      ListEmptyComponent={<AppText style={styles.empty}>No saved services yet.</AppText>}
    />
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
  profileCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...THEME.shadow
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28
  },
  userInfo: {
    flex: 1,
    marginLeft: THEME.spacing.sm
  },
  name: {
    fontSize: 17,
    textAlign: 'left'
  },
  email: {
    color: THEME.colors.textMuted,
    marginTop: 2,
    fontSize: 13,
    textAlign: 'left'
  },
  metaGrid: {
    marginTop: THEME.spacing.md,
    flexDirection: 'row',
    gap: THEME.spacing.sm
  },
  metaItem: {
    flex: 1,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    ...THEME.shadow
  },
  metaValue: {
    fontSize: 17,
    textAlign: 'center'
  },
  metaLabel: {
    marginTop: 4,
    color: THEME.colors.textMuted,
    fontSize: 12,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: THEME.spacing.lg,
    textAlign: 'left'
  },
  empty: {
    color: THEME.colors.textMuted,
    textAlign: 'left'
  }
});
