import React, { type ReactNode } from 'react';

import { Layering } from '@atlaskit/layering/layering';
import { fg } from '@atlaskit/platform-feature-flags/fg';

/**
 * Wraps an inline edit view, so that Escape cancels the edit and does not close a containing modal.
 *
 * With the top layer, the inline edit does this itself: an open menu takes the first Escape, then
 * the inline edit cancels the edit and keeps a containing modal open.
 */
export const InlineEditLayer = ({ children }: { children: ReactNode }): React.JSX.Element => {
	if (!fg('platform-dst-top-layer')) {
		// The Escape handler of a containing modal yields while this layer is open.
		return <Layering isDisabled={false}>{children}</Layering>;
	}

	return <>{children}</>;
};
