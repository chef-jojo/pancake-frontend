import get from "lodash/get";
import { Theme } from "@pancakeswap/styled";

const getThemeValue = (theme: Theme, path: string, fallback?: string | number): string => get(theme, path, fallback);

export default getThemeValue;
