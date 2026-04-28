import { ActivityIndicator, Pressable, Text } from "react-native";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "secondary";
  loading?: boolean;
};

const variantClasses = {
  primary: "bg-[#1d4ed8]",
  danger: "bg-[#dc2626]",
  secondary: "border border-white/10 bg-[#1a2230]",
};

const textClasses = {
  primary: "text-white",
  danger: "text-white",
  secondary: "text-slate-100",
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  loading = false,
}: AppButtonProps) {
  return (
    <Pressable
      className={`items-center rounded-2xl px-4 py-4 ${variantClasses[variant]}`}
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
