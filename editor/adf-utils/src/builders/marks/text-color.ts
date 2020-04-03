import { TextColorDefinition, TextColorAttributes } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithMark } from '../types';

export const textColor = (attrs: TextColorAttributes) => (
  maybeNode: WithMark | string,
) => applyMark<TextColorDefinition>({ type: 'textColor', attrs }, maybeNode);
