import type React from 'react';

import {
	EditorContentContainerCompiled,
	type EditorContentContainerProps,
} from './EditorContentContainer-compiled';

/**
 * The emotion implementation has been removed as part of the
 * platform_editor_core_static_css cleanup — the compiled implementation is now
 * the only one. This module stays as the entry point so consumers keep
 * importing from `./EditorContentContainer`.
 */
const EditorContentContainer: React.ForwardRefExoticComponent<
	EditorContentContainerProps & React.RefAttributes<HTMLDivElement>
> = EditorContentContainerCompiled;

export default EditorContentContainer;
