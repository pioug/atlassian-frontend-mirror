/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { Client, Provider, type ResolveResponse } from '../../src';
import { HoverCard } from '../../src/hoverCard';
import { mockConfluenceResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mockConfluenceResponse as ResolveResponse);
	}
}

const styles = css({
	display: 'flex',
	gap: '1rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		flexGrow: 1,
		padding: '1rem',
		backgroundColor: token('color.background.accent.lime.subtlest', '#eefbda'),
		'&:hover': {
			backgroundColor: token('color.background.accent.lime.bolder', '#5b7f24'),
		},
	},
});

export default () => {
	const [canOpen, setCanOpen] = useState(true);

	return (
		<VRTestWrapper>
			<Provider client={new CustomClient('staging')}>
				<HoverCard url="https://www.mockurl.com" canOpen={canOpen}>
					<div css={styles}>
						<div data-testid="hover-test-can-open-left" onMouseEnter={() => setCanOpen(true)}>
							Open
						</div>
						<div data-testid="hover-test-cannot-open" onMouseEnter={() => setCanOpen(false)}>
							Close
						</div>
						<div data-testid="hover-test-can-open-right" onMouseEnter={() => setCanOpen(true)}>
							Open
						</div>
					</div>
				</HoverCard>
			</Provider>
		</VRTestWrapper>
	);
};
