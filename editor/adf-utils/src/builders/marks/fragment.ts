import {
  type ExtensionDefinition,
  type BodiedExtensionDefinition,
  type InlineExtensionDefinition,
  type TableDefinition,
  type FragmentAttributes,
  type FragmentDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithAppliedMark } from '../types';

export const fragment =
  (attrs: FragmentAttributes) =>
  (
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
