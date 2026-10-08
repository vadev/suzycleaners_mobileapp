import { View } from 'react-native';
import { AppText, Button, Card, Screen, ScreenHeader, TextField, Toggle } from '@/components/ui';
import { useSettingsDraft } from '@/hooks/useSettingsDraft';
import { spacing } from '@/theme';

export default function BusinessProfile() {
  const { draft, setDraft, save, saving } = useSettingsDraft();
  return (
    <Screen>
      <ScreenHeader title="Business profile" />
      <Card style={{ gap: spacing.md }}>
        <TextField label="Business name" value={draft.businessName} onChangeText={(businessName) => setDraft({ ...draft, businessName })} />
        <TextField label="Home screen headline" value={draft.tagline} onChangeText={(tagline) => setDraft({ ...draft, tagline })} />
        <TextField label="Main phone" icon="phone-outline" value={draft.phone} onChangeText={(phone) => setDraft({ ...draft, phone })} keyboardType="phone-pad" />
        <TextField
          label="Second phone"
          icon="phone-plus-outline"
          value={draft.altPhone}
          onChangeText={(altPhone) => setDraft({ ...draft, altPhone })}
          keyboardType="phone-pad"
          hint="Leave empty to show only the main number."
        />
        <TextField label="Email" icon="email-outline" value={draft.email} onChangeText={(email) => setDraft({ ...draft, email })} autoCapitalize="none" keyboardType="email-address" />
        <TextField label="Website" icon="web" value={draft.website} onChangeText={(website) => setDraft({ ...draft, website })} autoCapitalize="none" />
        <TextField label="About Us" value={draft.about} onChangeText={(about) => setDraft({ ...draft, about })} multiline />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <AppText variant="bodyStrong" style={{ flex: 1 }}>
            Show Chamber Member recognition
          </AppText>
          <Toggle value={draft.chamberMember} onValueChange={(chamberMember) => setDraft({ ...draft, chamberMember })} />
        </View>
      </Card>
      <Button title="Save Profile" variant="dark" onPress={() => save()} loading={saving} style={{ marginTop: spacing.lg }} />
    </Screen>
  );
}
