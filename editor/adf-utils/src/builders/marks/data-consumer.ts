import {
  DataConsumerAttributes,
  DataConsumerDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithAppliedMark } from '../types';

export const dataConsumer = (attrs: DataConsumerAttributes) => (
  maybeNode: DataConsumerDefinition,
) => {
  return applyMark<DataConsumerDefinition>(
    { type: 'dataConsumer', attrs },
    maybeNode,
  ) as WithAppliedMark<typeof maybeNode, DataConsumerDefinition>;
};
