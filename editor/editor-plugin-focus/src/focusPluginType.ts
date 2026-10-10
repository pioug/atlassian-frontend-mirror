import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

import type { FocusState } from './types';

export type FocusPlugin = NextEditorPlugin<'focus', { sharedState: FocusState }>;
