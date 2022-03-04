import { stitches } from "../../theme/colors";
import { shadows } from "../../theme/base";
import { CardTheme } from "./types";

export const light: CardTheme = {
  background: stitches.theme.colors.backgroundAlt.computedValue,
  boxShadow: shadows.level1,
  boxShadowActive: shadows.active,
  boxShadowSuccess: shadows.success,
  boxShadowWarning: shadows.warning,
  cardHeaderBackground: {
    default: stitches.theme.colors.gradientsCardHeader.computedValue,
    blue: stitches.theme.colors.gradientsBlue.computedValue,
    bubblegum: stitches.theme.colors.gradientsBubblegum.computedValue,
    violet: stitches.theme.colors.gradientsViolet.computedValue,
  },
  dropShadow: "drop-shadow(0px 1px 4px rgba(25, 19, 38, 0.15))",
};

export const dark: CardTheme = {
  background: stitches.theme.colors.backgroundAlt.computedValue,
  boxShadow: shadows.level1,
  boxShadowActive: shadows.active,
  boxShadowSuccess: shadows.success,
  boxShadowWarning: shadows.warning,
  cardHeaderBackground: {
    default: stitches.theme.colors.gradientsCardHeader.computedValue,
    blue: stitches.theme.colors.gradientsBlue.computedValue,
    bubblegum: stitches.theme.colors.gradientsBubblegum.computedValue,
    violet: stitches.theme.colors.gradientsViolet.computedValue,
  },
  dropShadow: "drop-shadow(0px 1px 4px rgba(25, 19, 38, 0.15))",
};
