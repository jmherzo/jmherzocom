import { useColorMode, IconButton, IconButtonProps } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
function ToggleColor(
  ToggleColorProps: Omit<IconButtonProps, "onCLick" | "aria-label" | "icon">,
) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      {...ToggleColorProps}
      aria-label={`Click to change color mode ${colorMode}`}
      onClick={toggleColorMode}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    />
  );
}

export { ToggleColor };
