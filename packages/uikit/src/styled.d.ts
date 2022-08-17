import "@emotion/react";
import { PancakeTheme } from "./theme";

declare module "@emotion/react" {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface Theme extends PancakeTheme {}
}
