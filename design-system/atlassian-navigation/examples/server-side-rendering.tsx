/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import ReactDOMServer from 'react-dom/server';

import { Stack } from '@atlaskit/primitives/compiled';

import AuthenticatedExample from './10-authenticated-example';

export default function Component(): React.JSX.Element {
	return (
		<Stack space="space.300">
			<Stack space="space.100">
				<h2>SSR</h2>
				<div
					dangerouslySetInnerHTML={{
						__html: ReactDOMServer.renderToString(<AuthenticatedExample />),
					}}
				/>
			</Stack>
			<Stack space="space.100">
				<h2>Hydrated</h2>
				<AuthenticatedExample />
			</Stack>
		</Stack>
	);
}
