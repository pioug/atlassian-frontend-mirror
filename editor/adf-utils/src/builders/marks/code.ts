import { CodeDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithMark } from '../types';

export const code = (maybeNode: WithMark | string) =>
  applyMark<CodeDefinition>({ type: 'code' }, maybeNode);
