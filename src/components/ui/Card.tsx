import { ReactNode } from "react";
import { View } from "react-native";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <View
      className={`rounded-[24px] border border-white/10 bg-[#121923] p-4 shadow-2xl shadow-black/20 ${className}`}
    >
      {children}
    </View>
  );
}
