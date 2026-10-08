import { Pill } from '@/components/ui';
import { STATUS_META, type StatusTone } from '@/config/orderStatus';
import { colors } from '@/theme';
import type { OrderStatus } from '@/types';

export const toneColors: Record<StatusTone, { fg: string; bg: string }> = {
  info: { fg: colors.info, bg: colors.infoSoft },
  warning: { fg: colors.warning, bg: colors.warningSoft },
  progress: { fg: colors.royal, bg: colors.sky },
  success: { fg: colors.success, bg: colors.successSoft },
  neutral: { fg: colors.navy, bg: colors.beige },
  danger: { fg: colors.danger, bg: colors.dangerSoft },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  const c = toneColors[meta.tone];
  return <Pill label={meta.label} icon={meta.icon} color={c.fg} bg={c.bg} />;
}
