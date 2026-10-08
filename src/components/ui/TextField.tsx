import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, fonts, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface Props extends TextInputProps {
  label?: string;
  icon?: string;
  error?: string;
  hint?: string;
  counter?: number;
}

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, icon, error, hint, counter, style, multiline, onFocus, onBlur, value, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      {label ? (
        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          styles.field,
          multiline && styles.multiline,
          focused && styles.focused,
          !!error && styles.errored,
        ]}
      >
        {icon ? <Icon name={icon} size={20} color={focused ? colors.navy : colors.faint} /> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.faint}
          multiline={multiline}
          value={value}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, multiline && { minHeight: 76, textAlignVertical: 'top' }, style]}
          {...rest}
        />
      </View>
      {error ? (
        <AppText variant="small" style={{ color: colors.danger }}>
          {error}
        </AppText>
      ) : hint || counter ? (
        <View style={styles.meta}>
          <AppText variant="small">{hint ?? ''}</AppText>
          {counter ? <AppText variant="small">{`${(value ?? '').length}/${counter}`}</AppText> : null}
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { marginLeft: 4 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multiline: { alignItems: 'flex-start', paddingVertical: spacing.sm },
  focused: { borderColor: colors.navy, borderWidth: 1.5 },
  errored: { borderColor: colors.danger },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15.5, color: colors.ink, paddingVertical: 12 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
});
