/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { token } from '@atlaskit/tokens';

import { HoverCard } from '../../src/hoverCard';
import { mockConfluenceResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mockConfluenceResponse as JsonLd.Response);
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
			backgroundColor: token('color.background.accent.lime.subtle', '#94C747'),
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
						{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
						<div data-testid="hover-test-can-open-left" onMouseEnter={() => setCanOpen(true)}>
							Open
						</div>
						{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
						<div data-testid="hover-test-cannot-open" onMouseEnter={() => setCanOpen(false)}>
							Close
						</div>
						{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
						<div data-testid="hover-test-can-open-right" onMouseEnter={() => setCanOpen(true)}>
							Open
						</div>
					</div>
				</HoverCard>
			</Provider>
		</VRTestWrapper>
	);
};
