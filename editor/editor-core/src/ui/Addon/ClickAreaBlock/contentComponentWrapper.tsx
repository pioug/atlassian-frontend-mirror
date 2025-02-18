import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import type { ReactComponents } from '../../../types';

export const ignoreAttribute = 'data-editor-content-component';

/**
 * Wraps content components in a data attribute to ignore
 */
export const contentComponentClickWrapper = (
	reactComponents: ReactComponents | undefined,
): ReactComponents | undefined => {
	if (!fg('platform_editor_content_component_ignore_click')) {
		return reactComponents;
	}

	return <div data-editor-content-component={'true'}>{reactComponents}</div>;
};
