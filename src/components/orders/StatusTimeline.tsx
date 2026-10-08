import { StyleSheet, View } from 'react-native';
import { AppText, Icon } from '@/components/ui';
import { STATUS_META, timelineFor } from '@/config/orderStatus';
import { formatDay, parseDay, toDayKey } from '@/lib/format';
import { colors, fonts } from '@/theme';
import type { Order, OrderStatus } from '@/types';

/** Vertical progress tracker (mirrors the approved order-status mockup). */
export function StatusTimeline({ order }: { order: Order }) {
  const reached = order.history.map((h) => h.status);
  const steps = timelineFor(order.status, reached);
  const currentIdx = steps.indexOf(order.status);

  return (
    <View accessibilityRole="list">
      {steps.map((s, i) => {
        const done = i < currentIdx || (order.status === 'completed' && i === currentIdx);
        const current = i === currentIdx && order.status !== 'completed';
        const cancelled = s === 'cancelled';
        const event = [...order.history].reverse().find((h) => h.status === s);
        const when = event ? formatDay(event.at) : i > currentIdx ? estimateDay(order, s) : '';
        const last = i === steps.length - 1;
        return (
          <View key={s} style={styles.row} accessibilityLabel={`${STATUS_META[s].label}${done ? ', done' : current ? ', current' : ''}`}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  done && styles.dotDone,
                  current && (cancelled ? styles.dotCancelled : styles.dotCurrent),
                ]}
              >
                {done ? <Icon name="check" size={14} color={colors.white} /> : null}
                {current && !cancelled ? <View style={styles.dotCore} /> : null}
                {current && cancelled ? <Icon name="close" size={14} color={colors.white} /> : null}
              </View>
              {!last ? <View style={[styles.line, i < currentIdx ? styles.lineDone : styles.lineTodo]} /> : null}
            </View>
            <View style={styles.label}>
              <AppText
                style={[
                  styles.text,
                  current && { fontFamily: fonts.bold, color: cancelled ? colors.danger : colors.navy900 },
                  !done && !current && { color: colors.muted },
                ]}
              >
                {STATUS_META[s].label}
              </AppText>
              <AppText style={styles.date}>{when}</AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

/** Rough guide for upcoming steps, based on the requested pickup date. Staff updates replace these with real dates. */
const DAYS_AFTER_PICKUP: Partial<Record<OrderStatus, number>> = {
  pickup_confirmed: 0,
  driver_on_the_way: 0,
  picked_up: 0,
  cleaning_in_progress: 1,
  ready_for_pickup: 3,
  ready_for_delivery: 3,
  out_for_delivery: 3,
  completed: 3,
};

function estimateDay(order: Order, step: OrderStatus) {
  const offset = DAYS_AFTER_PICKUP[step];
  if (order.status === 'cancelled' || offset === undefined) return '';
  const d = parseDay(order.pickupDate);
  d.setDate(d.getDate() + offset);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return formatDay(toDayKey(d < today ? today : d));
}

const DOT = 26;
const styles = StyleSheet.create({
  row: { flexDirection: 'row', minHeight: 46 },
  rail: { width: DOT + 10, alignItems: 'center' },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
    borderColor: colors.faint,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.navy, borderColor: colors.navy },
  dotCurrent: { backgroundColor: colors.sunshine, borderColor: colors.sunshine },
  dotCancelled: { backgroundColor: colors.danger, borderColor: colors.danger },
  dotCore: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.white },
  line: { flex: 1, width: 3, marginVertical: 1 },
  lineDone: { backgroundColor: colors.navy },
  lineTodo: { borderLeftWidth: 2, borderStyle: 'dashed', borderColor: colors.faint, width: 0 },
  label: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 3, paddingLeft: 8, gap: 8 },
  text: { fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  date: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.navy700 },
});
