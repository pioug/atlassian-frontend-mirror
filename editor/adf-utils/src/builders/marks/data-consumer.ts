import {
  ExtensionDefinition,
  BodiedExtensionDefinition,
  InlineExtensionDefinition,
  DataConsumerAttributes,
  DataConsumerDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithAppliedMark } from '../types';

export const dataConsumer = (attrs: DataConsumerAttributes) => (
  maybeNode:
    | ExtensionDefinition
    | BodiedExtensionDefinition
    | InlineExtensionDefinition,
) => {
  return applyMark<DataConsumerDefinition>(
    { type: 'dataConsumer', attrs },
    maybeNode,
  ) as WithAppliedMark<typeof maybeNode, DataConsumerDefinition>;
};
