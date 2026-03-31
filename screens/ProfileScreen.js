import React from 'react';
import { FlatList, Image, StyleSheet, Switch, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { ServiceCard } from '../components/ServiceCard';
import { useServices } from '../context/ServicesContext';
import { useAppTheme } from '../context/ThemeContext';

export function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { services } = useServices();
  const { theme, mode, isDark, toggleMode } = useAppTheme();
  const styles = createStyles(theme);
  const savedServices = services.slice(0, 3);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.md }]}
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
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </Animated.View>

          <View style={styles.themeCard}>
            <View>
              <AppText weight="medium">Appearance</AppText>
              <AppText style={styles.themeSub}>{isDark ? 'Dark Mode' : 'Light Mode'}</AppText>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleMode}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>

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
                {mode === 'dark' ? 'Dark' : 'Light'}
              </AppText>
              <AppText style={styles.metaLabel}>Theme</AppText>
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

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xxl,
      paddingBottom: 120
    },
    profileCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadow
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28
    },
    userInfo: {
      flex: 1,
      marginLeft: theme.spacing.sm
    },
    name: {
      fontSize: 17,
      textAlign: 'left'
    },
    email: {
      color: theme.colors.textMuted,
      marginTop: 2,
      fontSize: 13,
      textAlign: 'left'
    },
    themeCard: {
      marginTop: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.shadow
    },
    themeSub: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 2
    },
    metaGrid: {
      marginTop: theme.spacing.md,
      flexDirection: 'row',
      gap: theme.spacing.sm
    },
    metaItem: {
      flex: 1,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      ...theme.shadow
    },
    metaValue: {
      fontSize: 17,
      textAlign: 'center'
    },
    metaLabel: {
      marginTop: 4,
      color: theme.colors.textMuted,
      fontSize: 12,
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: 20,
      marginVertical: theme.spacing.lg,
      textAlign: 'left'
    },
    empty: {
      color: theme.colors.textMuted,
      textAlign: 'left'
    }
  });
}
