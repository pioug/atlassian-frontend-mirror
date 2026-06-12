import React from 'react';

import type { ReactComponents } from '../../../types/editor-props';

export const ignoreAttribute = 'data-editor-content-component';

/**
 * Wraps content components in a data attribute to ignore
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const contentComponentClickWrapper = (
	reactComponents: ReactComponents | undefined,
): ReactComponents | undefined => {
	return <div data-editor-content-component={'true'}>{reactComponents}</div>;
};
