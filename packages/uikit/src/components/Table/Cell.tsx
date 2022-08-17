import styled from "@emotion/styled";
import { typography, TypographyProps } from "styled-system";

export const Td = styled.td<TypographyProps>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  color: ${({ theme }) => theme.colors.text};
  padding: 16px;
  vertical-align: middle;

  ${typography}
`;

export const Th = styled(Td)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  text-transform: uppercase;
`;

Th.defaultProps = {
  as: "th",
};
