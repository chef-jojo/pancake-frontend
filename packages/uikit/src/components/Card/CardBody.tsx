import styled from "@emotion/styled";
import { space, SpaceProps } from "styled-system";

export type CardBodyProps = SpaceProps;

const CardBody = styled.div<CardBodyProps>`
  ${space}
`;

CardBody.defaultProps = {
  p: "24px",
};

export default CardBody;
