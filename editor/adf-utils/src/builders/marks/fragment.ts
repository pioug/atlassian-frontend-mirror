import {
  ExtensionDefinition,
  BodiedExtensionDefinition,
  InlineExtensionDefinition,
  TableDefinition,
  FragmentAttributes,
  FragmentDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithAppliedMark } from '../types';

export const fragment = (attrs: FragmentAttributes) => (
  maybeNode:
    | TableDefinition
    | ExtensionDefinition
    | BodiedExtensionDefinition
    | InlineExtensionDefinition,
) => {
  return applyMark<FragmentDefinition>(
    { type: 'fragment', attrs },
    maybeNode,
  ) as WithAppliedMark<typeof maybeNode, FragmentDefinition>;
};
