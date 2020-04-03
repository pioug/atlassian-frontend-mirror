import { StrikeDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithMark } from '../types';

export const strike = (maybeNode: WithMark | string) =>
  applyMark<StrikeDefinition>({ type: 'strike' }, maybeNode);
