import React, { ComponentProps } from "react";
import styled from "@emotion/styled";
import EXTERNAL_LINK_PROPS from "../../util/externalLinkProps";
import Text from "../Text/Text";
import { TextProps } from "../Text";

interface StyledLinkProps extends TextProps {
  external?: boolean;
}

const StyledLink = styled(Text)<StyledLinkProps>`
  display: flex;
  align-items: center;
  width: fit-content;
  &:hover {
    text-decoration: underline;
  }
`.withComponent("a");

export type LinkProps = ComponentProps<typeof StyledLink>;

const Link: React.FC<React.PropsWithChildren<LinkProps>> = ({ external, ...props }) => {
  const internalProps = external ? EXTERNAL_LINK_PROPS : {};
  return <StyledLink as="a" bold {...internalProps} {...props} />;
};

/* eslint-disable react/default-props-match-prop-types */
Link.defaultProps = {
  color: "primary",
};

export default Link;
