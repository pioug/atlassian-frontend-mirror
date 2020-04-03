import { StrongDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithMark } from '../types';

export const strong = (maybeNode: WithMark | string) =>
  applyMark<StrongDefinition>({ type: 'strong' }, maybeNode);
