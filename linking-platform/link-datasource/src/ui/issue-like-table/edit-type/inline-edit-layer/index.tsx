import React, { type ReactNode, useCallback } from 'react';

import { Layering } from '@atlaskit/layering/layering';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { hasOpenDialogOrPopover } from '@atlaskit/top-layer/page-surface/has-open-dialog-or-popover';
import { requestClosePopovers } from '@atlaskit/top-layer/page-surface/request-close-popovers';

/**
 * Wraps an inline edit view, so that Escape cancels the edit and does not close a containing modal.
 */
export const InlineEditLayer = ({ children }: { children: ReactNode }): React.JSX.Element => {
	const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== 'Escape') {
			return;
		}

		// An open menu takes the first Escape, and the edit stays open (as with layering).
		if (hasOpenDialogOrPopover({ within: event.currentTarget })) {
			event.stopPropagation();
			event.preventDefault();
			requestClosePopovers({ within: event.currentTarget });
			return;
		}

		// The inline edit form still cancels the edit. A containing modal ignores a prevented Escape.
		event.preventDefault();
	}, []);

	if (!fg('platform-dst-top-layer')) {
		// The Escape handler of a containing modal yields while this layer is open.
		return <Layering isDisabled={false}>{children}</Layering>;
	}

	return (
		<div role="presentation" onKeyDown={onKeyDown}>
			{children}
		</div>
	);
};
