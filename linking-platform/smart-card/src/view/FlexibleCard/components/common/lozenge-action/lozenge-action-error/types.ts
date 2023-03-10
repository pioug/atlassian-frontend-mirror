import type { InvokeActionError } from '../../../../../../state/hooks/use-invoke/types';

export type LozengeActionErrorProps = {
  errorCode: InvokeActionError;
  testId?: string;
};
