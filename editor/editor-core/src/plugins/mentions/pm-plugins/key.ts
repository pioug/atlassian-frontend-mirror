import { PluginKey } from 'prosemirror-state';
import { MentionPluginState } from '../types';

export const mentionPluginKey = new PluginKey<MentionPluginState>(
  'mentionPlugin',
);
