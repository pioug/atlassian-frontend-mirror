import {
  BorderMarkDefinition,
  BorderMarkAttributes,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithMark } from '../types';

export const border =
  (attrs: BorderMarkAttributes) => (maybeNode: WithMark | string) =>
    applyMark<BorderMarkDefinition>({ type: 'border', attrs }, maybeNode);
