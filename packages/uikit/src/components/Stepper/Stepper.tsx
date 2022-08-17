import styled from "@emotion/styled";
import React from "react";

const StepperWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
`;

const Stepper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const numberOfSteps = React.Children.count(children);
  return (
    <StepperWrapper>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { numberOfSteps });
        }
        return child;
      })}
    </StepperWrapper>
  );
};

export default Stepper;
