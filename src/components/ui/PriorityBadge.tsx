import { Text, View } from "react-native";
import { Severity } from "../../types";

type PriorityBadgeProps = {
  severity: Severity;
};

const viewStyles: Record<Severity, string> = {
  low: "border border-emerald-400/30 bg-emerald-500/15",
  medium: "border border-orange-400/30 bg-orange-500/15",
  critical: "border border-red-400/30 bg-red-500/15",
};

const textStyles: Record<Severity, string> = {
  low: "text-emerald-300",
  medium: "text-orange-300",
  critical: "text-red-300",
};

const labels: Record<Severity, string> = {
  low: "Normal",
  medium: "Urgent",
  critical: "Critique",
};

export function PriorityBadge({ severity }: PriorityBadgeProps) {
  return (
    <View className={`self-start rounded-full px-3 py-1 ${viewStyles[severity]}`}>
      <Text className={`font-semibold ${textStyles[severity]}`}>{labels[severity]}</Text>
    </View>
  );
}
