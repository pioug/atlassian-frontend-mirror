import type React from 'react';

import {
	EditorContentContainerCompiled,
	type EditorContentContainerProps,
} from './EditorContentContainer-compiled';

/**
 * This module exposes the Compiled implementation as the entry point so consumers keep
 * importing from `./EditorContentContainer`.
 */
const EditorContentContainer: React.ForwardRefExoticComponent<
	EditorContentContainerProps & React.RefAttributes<HTMLDivElement>
> = EditorContentContainerCompiled;

export default EditorContentContainer;
