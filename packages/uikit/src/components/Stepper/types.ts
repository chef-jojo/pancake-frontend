import { Theme } from "@emotion/react";

export interface ThemedProps {
  theme: Theme;
}

export type Status = "past" | "current" | "future";

export interface StatusProps {
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
