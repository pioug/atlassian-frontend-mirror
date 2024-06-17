/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import ExampleContainer from './example-container';
import { useState } from 'react';

import { Provider, Client } from '../../src';
import { HoverCard } from '../../src/hoverCard';
import { Checkbox } from '@atlaskit/checkbox';
import { token } from '@atlaskit/tokens';

export default () => {
	const [canOpen, setCanOpen] = useState(true);

	return (
		<ExampleContainer>
			<Provider client={new Client('staging')}>
				<HoverCard url="https://www.youtube.com/watch?v=8xiwyk3ouuI" canOpen={canOpen}>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={{ border: '1px solid', padding: token('space.250', '20px') }}>
						Hover over me!
					</div>
				</HoverCard>
			</Provider>
			<Checkbox isChecked={canOpen} onChange={() => setCanOpen(!canOpen)} label="canOpen" />
		</ExampleContainer>
	);
};
