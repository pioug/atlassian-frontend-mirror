import { Stack } from '@atlaskit/primitives';
import React from 'react';
import { InlineCardResolvingView as ResolvingView } from '../src/view/InlineCard';
import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

const url = 'https://product-fabric.atlassian.net/browse/MSW-524';
const onClick = () => window.open(url);

export default () => (
	<ExampleContainer title="InlineCard Views">
		<Stack>
			<h6>[Resolving]</h6>
			<ResolvingView inlinePreloaderStyle="on-left-with-skeleton" url={url} onClick={onClick} />
			<CardViewExample appearance="inline" />
		</Stack>
	</ExampleContainer>
);
