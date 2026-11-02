import React from 'react';

import { ExpandedFrame } from '@atlaskit/smart-card/expanded-frame';

function HeaderControl(): React.JSX.Element {
	const [clicked, setClicked] = React.useState(false);
	return (
		<button
			aria-pressed={clicked}
			data-testid="embed-frame-header-control"
			onClick={() => setClicked(true)}
		>
			Frame action
		</button>
	);
}

export default function EmbedFrameNavigationExample(): React.JSX.Element {
	const [contentButtonClicked, setContentButtonClicked] = React.useState(false);
	const href = new URL('#embed-frame-navigation-target', window.location.href).href;

	return (
		<ExpandedFrame
			allowScrollBar={true}
			frameStyle="show"
			href={href}
			CompetitorPrompt={HeaderControl}
			setOverflow={true}
			testId="embed-frame"
			text="Project overview"
		>
			<div>
				<button
					aria-pressed={contentButtonClicked}
					data-testid="embed-frame-content-button"
					onClick={() => setContentButtonClicked(true)}
				>
					Content action
				</button>
				<iframe
					title="Embedded content"
					data-testid="embed-frame-iframe"
					width="100%"
					height="220"
					srcDoc={`<!doctype html><button onclick="this.textContent = 'Clicked'">Embedded content action</button>`}
				/>
			</div>
		</ExpandedFrame>
	);
}
