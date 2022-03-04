import { shadows } from "../../theme/base";
import { stitches } from "../../theme/colors";
import { TooltipTheme } from "./types";

export const light: TooltipTheme = {
  background: stitches.theme.colors.backgroundAlt.computedValue,
  text: stitches.theme.colors.textInverted.computedValue,
  boxShadow: shadows.tooltip,
};

export const dark: TooltipTheme = {
  background: stitches.theme.colors.backgroundAlt.computedValue,
  text: stitches.theme.colors.textInverted.computedValue,
  boxShadow: shadows.tooltip,
};
