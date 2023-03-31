import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

type ColorMode = "system" | "light" | "dark" | undefined;

type Config = {
  initialColorMode: ColorMode;
  useSystemColorMode: boolean;
};

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme: Record<string, ThemeConfig> = extendTheme({ config });

export default theme;
