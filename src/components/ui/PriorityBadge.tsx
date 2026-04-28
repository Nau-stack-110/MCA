import { Text, View } from "react-native";
import { Severity } from "../../types";

type PriorityBadgeProps = {
  severity: Severity;
};

const viewStyles: Record<Severity, string> = {
  low: "bg-emerald-100",
  medium: "bg-amber-100",
  critical: "bg-red-100",
};

const textStyles: Record<Severity, string> = {
  low: "text-emerald-700",
  medium: "text-amber-700",
  critical: "text-red-700",
};

export function PriorityBadge({ severity }: PriorityBadgeProps) {
  return (
    <View className={`self-start rounded-full px-3 py-1 ${viewStyles[severity]}`}>
      <Text className={`font-semibold capitalize ${textStyles[severity]}`}>{severity}</Text>
    </View>
  );
}
