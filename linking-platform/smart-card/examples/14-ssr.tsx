import React from 'react';
import { token } from '@atlaskit/tokens';
import {
	Provider,
	Client,
	TitleBlock,
	ActionName,
	SmartLinkDirection,
	SmartLinkPosition,
} from '../src';
import { CardSSR } from '../src/ssr';
import { url, cardState } from './utils/smart-card-ssr-state';
import { type CardProviderStoreOpts } from '@atlaskit/link-provider';

const storeOptions: CardProviderStoreOpts = {
	initialState: {
		[url]: cardState,
	},
};

export default () => (
	<Provider storeOptions={storeOptions} client={new Client('stg')}>
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '680px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				margin: '0 auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginTop: token('space.800', '64px'),
			}}
		>
			<h4>Inline:</h4>
			<CardSSR appearance="inline" url={url} />

			<h4>Flexible:</h4>
			<CardSSR appearance="block" url={url}>
				<TitleBlock
					direction={SmartLinkDirection.Horizontal}
					maxLines={1}
					position={SmartLinkPosition.Center}
					text={'this is a test'}
					anchorTarget={'_blank'}
					hideTitleTooltip
					actions={[
						{
							name: ActionName.DeleteAction,
							onClick: () => {},
							iconPosition: 'before',
							content: 'Delete',
							hideContent: true,
							hideIcon: false,
							testId: 'deleteAction',
						},
					]}
					showActionOnHover
				/>
			</CardSSR>
		</div>
	</Provider>
);
