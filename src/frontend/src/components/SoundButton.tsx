import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";
import { useSound } from "../hooks/useSound";

type SoundButtonProps = ComponentProps<typeof Button>;

export default function SoundButton({
  onClick,
  onMouseEnter,
  children,
  ...props
}: SoundButtonProps) {
  const { playClick, playHover } = useSound();

  return (
    <Button
      {...props}
      onMouseEnter={(e) => {
        playHover();
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        playClick();
        onClick?.(e as React.MouseEvent<HTMLButtonElement>);
      }}
    >
      {children}
    </Button>
  );
}
