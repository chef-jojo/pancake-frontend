import styled from "@emotion/styled";
import { Colors } from "../../theme/types";
import Text from "./Text";

const TooltipText = styled(Text)<{ decorationColor?: keyof Colors }>`
  text-decoration: ${({ theme, decorationColor }) =>
    `underline dotted ${theme?.colors && decorationColor ? theme.colors[decorationColor] : theme?.colors?.textSubtle}`};
  text-underline-offset: 0.1em;
`;

export default TooltipText;
