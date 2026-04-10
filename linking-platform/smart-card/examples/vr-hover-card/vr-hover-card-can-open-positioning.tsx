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

import '../utils/vr-preload-metadata-icons';

class CustomClient extends Client {
	fetchData(_: string) {
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
		backgroundColor: token('color.background.accent.lime.subtlest'),
		'&:hover': {
			backgroundColor: token('color.background.accent.lime.subtle'),
		},
	},
});

export default (): JSX.Element => {
	const [canOpen, setCanOpen] = useState(true);

	const setCanOpenTrue = () => setCanOpen(true);
	const setCanOpenFalse = () => setCanOpen(false);

	return (
		<VRTestWrapper>
			<Provider client={new CustomClient('staging')}>
				<HoverCard
					url="https://www.mockurl.com"
					canOpen={canOpen}
					hoverPreviewOptions={{ fadeInDelay: 0 }}
				>
					<div css={styles}>
						<div
							data-testid="hover-test-can-open-left"
							onFocus={setCanOpenTrue}
							onMouseEnter={setCanOpenTrue}
							role="button"
							tabIndex={0}
						>
							Open
						</div>
						<div
							data-testid="hover-test-cannot-open"
							onFocus={setCanOpenFalse}
							onMouseEnter={setCanOpenFalse}
							role="button"
							tabIndex={0}
						>
							Close
						</div>
						<div
							data-testid="hover-test-can-open-right"
							onFocus={setCanOpenTrue}
							onMouseEnter={setCanOpenTrue}
							role="button"
							tabIndex={0}
						>
							Open
						</div>
					</div>
				</HoverCard>
			</Provider>
		</VRTestWrapper>
	);
};
