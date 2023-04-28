import { MessageProps } from '../../../types';
import { messages } from '../../../../../../messages';

export type LozengeActionErrorProps = {
  errorMessage: string | MessageProps;
  testId?: string;
  maxLineNumber?: number;
};

export const LozengeActionErrorMessages = {
  noData: {
    descriptor: messages['status_change_permission_error'],
  },
  unknown: {
    descriptor: messages['status_change_load_error'],
  },
  updateFailed: {
    descriptor: messages['status_change_update_error'],
  },
};
