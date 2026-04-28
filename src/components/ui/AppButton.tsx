import { ActivityIndicator, Pressable, Text } from "react-native";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "secondary";
  loading?: boolean;
};

const variantClasses = {
  primary: "bg-blue-600",
  danger: "bg-red-600",
  secondary: "bg-slate-200",
};

const textClasses = {
  primary: "text-white",
  danger: "text-white",
  secondary: "text-slate-800",
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  loading = false,
}: AppButtonProps) {
  return (
    <Pressable
      className={`items-center rounded-xl px-4 py-3 ${variantClasses[variant]}`}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={`text-base font-semibold ${textClasses[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
