import { Alert as NativeAlert, Platform, type AlertButton } from 'react-native';

/**
 * Drop-in replacement for React Native's Alert that also works on web
 * (react-native-web's Alert is a no-op), so confirmations behave the same
 * everywhere.
 */
export const Alert = {
  alert(title: string, message?: string, buttons?: AlertButton[]) {
    if (Platform.OS !== 'web') return NativeAlert.alert(title, message, buttons);
    const text = message ? `${title}\n\n${message}` : title;
    const action = buttons?.find((b) => b.style !== 'cancel');
    if (!buttons || buttons.length <= 1) {
      window.alert(text);
      action?.onPress?.();
      return;
    }
    if (window.confirm(text)) action?.onPress?.();
    else buttons.find((b) => b.style === 'cancel')?.onPress?.();
  },
};
