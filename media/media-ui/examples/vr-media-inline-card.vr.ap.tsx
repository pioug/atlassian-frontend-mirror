import React from 'react';

import { token } from '@atlaskit/tokens';

import { Container } from '../example-helpers/styled';
import { MediaInlineCardErroredView } from '../src/MediaInlineCard/ErroredView';
import { MediaInlineCardLoadedView } from '../src/MediaInlineCard/LoadedView';
import { MediaInlineCardLoadingView } from '../src/MediaInlineCard/LoadingView';

export default (): React.JSX.Element => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			padding: token('space.400'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			display: 'flex',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			flexDirection: 'column',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			gap: token('space.200'),
		}}
	>
		<Container
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				gap: token('space.200'),
			}}
		>
			<MediaInlineCardLoadingView message="I'm loading" />
			<MediaInlineCardLoadedView title="I'm loaded" />
			<MediaInlineCardErroredView message="Ups! an error" />
		</Container>
		<Container
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				gap: token('space.200'),
			}}
		>
			<MediaInlineCardLoadingView message="I'm loading" isSelected />
			<MediaInlineCardLoadedView title="I'm loaded" isSelected />
			<MediaInlineCardErroredView message="Ups! an error" isSelected />
		</Container>
	</div>
);
