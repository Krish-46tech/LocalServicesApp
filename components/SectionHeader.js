import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { ScalePressable } from './ScalePressable';
import { useAppTheme } from '../context/ThemeContext';

export function SectionHeader({ title, actionLabel, onActionPress }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <AppText weight="bold" style={styles.title}>
        {title}
      </AppText>
      {actionLabel ? (
        <ScalePressable onPress={onActionPress}>
          <AppText weight="medium" style={styles.action}>
            {actionLabel}
          </AppText>
        </ScalePressable>
      ) : null}
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md
    },
    title: {
      fontSize: 20
    },
    action: {
      color: theme.colors.primary,
      fontSize: 14
    }
  });
}
