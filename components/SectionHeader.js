import React from 'react';
import { StyleSheet, View } from 'react-native';
import { THEME } from '../constants/theme';
import { AppText } from './AppText';
import { ScalePressable } from './ScalePressable';

export function SectionHeader({ title, actionLabel, onActionPress }) {
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md
  },
  title: {
    fontSize: 20
  },
  action: {
    color: THEME.colors.primary,
    fontSize: 14
  }
});
