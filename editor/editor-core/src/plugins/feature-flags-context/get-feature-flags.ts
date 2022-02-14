import { pluginKey } from './plugin-key';
import { EditorState } from 'prosemirror-state';
import type { FeatureFlags } from '../../types/feature-flags';

export const getFeatureFlags = (state: EditorState): FeatureFlags =>
  pluginKey.getState(state);
