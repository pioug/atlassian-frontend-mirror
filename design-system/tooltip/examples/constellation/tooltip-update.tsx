import React from 'react';

import Button from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

const shortMessage = "I'm a short tooltip";
const longMessage = 'I am a longer tooltip with a decent amount of content inside';

export default () => {
	const [message, setMessage] = React.useState(shortMessage);
	const updateTooltip = React.useRef<() => void>();

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
			{({ onClick, ...tooltipProps }) => (
				<Button
					onClick={() => setMessage(message === shortMessage ? longMessage : shortMessage)}
					{...tooltipProps}
				>
					Click to toggle tooltip
				</Button>
			)}
		</Tooltip>
	);
};
