import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import { type InteractionState } from './types';

export type InteractionPlugin = NextEditorPlugin<'interaction', { sharedState: InteractionState }>;
