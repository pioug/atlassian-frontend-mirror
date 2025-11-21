import React from 'react';
import { payloadPublisher } from '@atlassian/ufo';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionsView, ConnectedReactionPicker, type StorePropInput } from '../src';
import { ExampleWrapper, Constants } from './utils';

type SendOperationEventHandler = (payload: unknown) => unknown;

/**
 * The publisher will be set up in product side in the real world, We add it in the example here so we can see events coming from UFO in the console browser object
 * @param product name of application
 * @param {SendOperationEventHandler} (Optional) callback when a ufo event is occuring
 * @param {string} version (Optional) the web application version (defaults to "1.0.0")
 * @returns {void}
 */
const setupPublisher = ({
	product,
	onSendOperationalEvent = (event) => {
		// eslint-disable-next-line no-console
		console.info('ufoEvent:', event);
	},
	version = '1.0.0',
}: {
	onSendOperationalEvent?: SendOperationEventHandler;
	product: string;
	version?: string;
}) => {
	payloadPublisher.setup({
		product,
		gasv3: {
			sendOperationalEvent: onSendOperationalEvent,
		},
		app: { version: { web: version } },
	});
};

/**
 * The version from package.json file
 */
const { version } = require('../package.json');

// /**
//  * The publisher will be set up in product side in the real world, We add it in the example here so we can see events coming from UFO in the console browser object
//  */
setupPublisher({ product: 'reactions-demo', version });
// UFO.setLogger(true);

export default (): React.JSX.Element => {
	return (
		<ExampleWrapper>
			{(store: StorePropInput) => (
				<>
					<p>
						As a first step, UFO requires a publisher object that dispatch events dispatched from
						the @atlaskit/ufo package (e.g. success/failure).
					</p>
					<p>
						This examples demostrates both `ReactionPicker` and `ReactionsView` components, that
						share the same store instance and posting requests with UFO metrics data. You can viewe
						these events inside the console.info under the `ufoEvent` wrapper
					</p>

					<hr role="presentation" />

					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ marginTop: '30px' }}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<h5>Connected reactions picker</h5>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
							<div style={{ marginTop: '10px' }}>
								<ConnectedReactionPicker
									store={store}
									containerAri={`${Constants.ContainerAriPrefix}1`}
									ari={`${Constants.AriPrefix}1`}
									emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								/>
							</div>
						</div>

						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<h5>Connected reactions view</h5>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
							<div style={{ marginTop: '10px' }}>
								<ConnectedReactionsView
									store={store}
									containerAri={`${Constants.ContainerAriPrefix}1`}
									ari={`${Constants.AriPrefix}1`}
									emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
									allowUserDialog
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</ExampleWrapper>
	);
};
