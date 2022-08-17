import "@pancakeswap/styled";
import { PancakeTheme } from "./theme";

declare module "@pancakeswap/styled" {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface Theme extends PancakeTheme {}
}
