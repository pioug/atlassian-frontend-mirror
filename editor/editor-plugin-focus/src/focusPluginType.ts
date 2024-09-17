import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import { type FocusState } from './types';

export type FocusPlugin = NextEditorPlugin<'focus', { sharedState: FocusState }>;
