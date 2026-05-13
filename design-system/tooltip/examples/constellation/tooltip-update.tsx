import React, { type ReactNode, useEffect, useLayoutEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Inline } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';

/**
 * Content updates after a timeout only (no click).
 * Example was changed from click-to-toggle so that with top-layer (popover="hint"), testing
 * doesn't trigger light-dismiss: clicking outside the tooltip closes it, which made the
 * update example appear broken. Hover + wait for timeout avoids that.
 */
const CONTENT_UPDATE_DELAY_MS = 2000;

function TooltipContent({ update }: { update?: () => void }): ReactNode {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const id = setTimeout(() => {
			setIsLoading(false);
		}, CONTENT_UPDATE_DELAY_MS);
		return () => clearTimeout(id);
	}, []);

	useLayoutEffect(() => {
		update?.();
	}, [isLoading, update]);

	return isLoading ? 'Loading...' : 'I am a lazy loaded tooltip, with a lot of content';
}

export default function TooltipUpdateContentExample(): React.JSX.Element {
	return (
		<Inline space="space.100">
			<Tooltip content={({ update }) => <TooltipContent update={update} />}>
				{(tooltipProps) => (
					<Button {...tooltipProps}>
						Hover and wait — content updates after {CONTENT_UPDATE_DELAY_MS / 1000}s
					</Button>
				)}
			</Tooltip>

			<Tooltip content={() => <TooltipContent />}>
				{(tooltipProps) => <Button {...tooltipProps}>Not using the update callback</Button>}
			</Tooltip>
		</Inline>
	);
}
