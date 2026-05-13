import React, { useEffect } from 'react';

import {
	useCrossProductUrlWrapper,
	INTERNAL_CLIENT_WINDOW_KEY,
	INTERACTION_SESSION_ID_UPDATED_EVENT,
} from '../src';

// Superficial implementation of @atlassiansox/analytics-cross-product-interaction-client - InteractionSessionTracking
// class for the purposes of testing the hook in this public package
class MockInteractionSessionClient {
	private interactionSession: number;

	constructor() {
		this.interactionSession = Date.now();
	}

	getCurrentInteractionSessionId() {
		return this.interactionSession;
	}

	regenerateInteractionSessionId() {
		this.interactionSession = Date.now();
		document.dispatchEvent(new Event(INTERACTION_SESSION_ID_UPDATED_EVENT));
	}
}

const ExampleBridgeComponent = ({
	href,
	children,
}: {
	children: React.ReactNode;
	href: string;
}) => {
	// 1. Initialize the hook with the required parameters
	const withInteractionSession = useCrossProductUrlWrapper({
		bridge: 'afmExample', // The name of your bridge component e.g. atlassianSwitcher
		product: 'jira', // The product you are hosted on e.g. jira
		subProduct: 'basicExample', // Optional - include if required
	});

	// 2. Wrap your URL with the function returned from the hook
	const wrappedHref = withInteractionSession(href);
	// eslint-disable-next-line @atlaskit/design-system/no-html-anchor -- This example intentionally uses a plain anchor to avoid restoring docs-only ADS link dependencies.
	return <a href={wrappedHref}>{children}</a>;
};

export default function Basic(): React.JSX.Element {
	let globalInteractionSessionTracking: MockInteractionSessionClient;

	useEffect(() => {
		globalInteractionSessionTracking = new MockInteractionSessionClient();
	});

	return (
		<div>
			<p>
				These functions would usually be handled by
				@atlassiansox/analytics-cross-product-interaction-client. Here they are manually triggered
				to test functionality in the sandbox
			</p>
			<button
				onClick={() => {
					(window as any)[INTERNAL_CLIENT_WINDOW_KEY] = globalInteractionSessionTracking;
				}}
			>
				Initialise Interaction Session Client
			</button>
			<button
				onClick={() => {
					globalInteractionSessionTracking.regenerateInteractionSessionId();
				}}
			>
				Generate interaction session ID
			</button>
			<p>
				This is a simple example to demonstrate the usage of the analytics cross-product interaction
				client URL wrapper hook in the case where the bridge components render before the analytics
				web client
			</p>
			<p>
				<ExampleBridgeComponent href={'https://www.yahoo.com/'}>Yahoo</ExampleBridgeComponent>
			</p>
			<p>
				<ExampleBridgeComponent href={'https://www.google.com/'}>Google</ExampleBridgeComponent>
			</p>
			<p>
				<ExampleBridgeComponent href={'https://www.youtube.com/'}>YouTube</ExampleBridgeComponent>
			</p>
			<p>
				<ExampleBridgeComponent href={'https://www.atlassian.com/'}>
					Atlassian
				</ExampleBridgeComponent>
			</p>
		</div>
	);
}
