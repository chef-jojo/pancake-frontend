import { Theme } from "@pancakeswap/styled";

export interface ThemedProps {
  theme: Theme;
}

export type Status = "past" | "current" | "future";

export interface StatusProps extends ThemedProps {
  theme: Theme;
  status?: Status;
  $isFirstStep?: boolean;
  $isLastStep?: boolean;
  $isFirstPart?: boolean;
}

export interface StepProps {
  index: number;
  statusFirstPart: Status;
  statusSecondPart?: Status;
  numberOfSteps?: number;
}
