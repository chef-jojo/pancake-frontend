import { stitches } from "../../theme/colors";
import { PancakeToggleTheme } from "./types";

export const light: PancakeToggleTheme = {
  handleBackground: stitches.theme.colors.backgroundAlt.computedValue,
  handleShadow: stitches.theme.colors.textDisabled.computedValue,
};

export const dark: PancakeToggleTheme = {
  handleBackground: stitches.theme.colors.backgroundAlt.computedValue,
  handleShadow: stitches.theme.colors.textDisabled.computedValue,
};
