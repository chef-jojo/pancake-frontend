import { stitches } from "../../theme/colors";

export type ToggleTheme = {
  handleBackground: string;
};

export const light: ToggleTheme = {
  handleBackground: stitches.theme.colors.backgroundAlt.computedValue,
};

export const dark: ToggleTheme = {
  handleBackground: stitches.theme.colors.backgroundAlt.computedValue,
};
