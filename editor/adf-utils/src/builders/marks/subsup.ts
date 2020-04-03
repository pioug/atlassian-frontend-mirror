import { SubSupDefinition, SubSupAttributes } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithMark } from '../types';

export const subsup = (attrs: SubSupAttributes) => (
  maybeNode: WithMark | string,
) => applyMark<SubSupDefinition>({ type: 'subsup', attrs }, maybeNode);
