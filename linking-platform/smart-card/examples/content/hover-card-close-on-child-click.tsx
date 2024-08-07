/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import ExampleContainer from './example-container';

import { Provider, Client } from '../../src';
import { HoverCard } from '../../src/hoverCard';

export default () => (
	<ExampleContainer>
		<Provider client={new Client('staging')}>
			<HoverCard url="https://www.atlassian.com/" closeOnChildClick={true}>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div css={{ border: '1px solid', padding: token('space.250', '20px') }}>Hover over me!</div>
			</HoverCard>
		</Provider>
	</ExampleContainer>
);
