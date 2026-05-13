import React from 'react';

import Button from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

const shortMessage = "I'm a short tooltip";
const longMessage = 'I am a longer tooltip with a decent amount of content inside';

/**
 * Content updates after a timeout only (no click).
 * Example was changed from click-to-toggle so that with top-layer (popover="hint"), testing
 * doesn't trigger light-dismiss: clicking outside the tooltip closes it, which made the
 * update example appear broken. Hover + wait for timeout avoids that.
 */
const CONTENT_UPDATE_DELAY_MS = 2000;

export default function TooltipUpdateExample(): React.JSX.Element {
	const [message, setMessage] = React.useState(shortMessage);
	const updateTooltip = React.useRef<() => void>();

	React.useEffect(() => {
		const id = setTimeout(() => {
			setMessage(longMessage);
		}, CONTENT_UPDATE_DELAY_MS);
		return () => clearTimeout(id);
	}, []);

	React.useLayoutEffect(() => {
		updateTooltip.current?.();
	}, [message]);

	return (
		<Tooltip
			content={({ update }) => {
				updateTooltip.current = update;
				return message;
			}}
		>
			{(tooltipProps) => (
				<Button {...tooltipProps}>
					Hover and wait — content updates after {CONTENT_UPDATE_DELAY_MS / 1000}s
				</Button>
			)}
		</Tooltip>
	);
}
