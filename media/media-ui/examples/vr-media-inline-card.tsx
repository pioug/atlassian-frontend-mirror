import React from 'react';
import { Container } from '../example-helpers/styled';

import {
	MediaInlineCardErroredView,
	MediaInlineCardLoadedView,
	MediaInlineCardLoadingView,
} from '../src';

import { token } from '@atlaskit/tokens';

export default (): React.JSX.Element => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			padding: token('space.400', '2rem'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			display: 'flex',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			flexDirection: 'column',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			gap: token('space.200', '1rem'),
		}}
	>
		<Container
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				gap: token('space.200', '1rem'),
			}}
		>
			<MediaInlineCardLoadingView message="I'm loading" />
			<MediaInlineCardLoadedView title="I'm loaded" />
			<MediaInlineCardErroredView message="Ups! an error" />
		</Container>
		<Container
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				gap: token('space.200', '1rem'),
			}}
		>
			<MediaInlineCardLoadingView message="I'm loading" isSelected />
			<MediaInlineCardLoadedView title="I'm loaded" isSelected />
			<MediaInlineCardErroredView message="Ups! an error" isSelected />
		</Container>
	</div>
);
