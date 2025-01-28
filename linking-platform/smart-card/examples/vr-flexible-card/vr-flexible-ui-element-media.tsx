/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { smallImage, wideImage } from '@atlaskit/media-test-helpers';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { MediaType } from '../../src/constants';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { Preview } from '../../src/view/FlexibleCard/components/elements';
import { getContext } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

import Old from './vr-flexible-ui-element-mediaOld';

const context = getContext({
	preview: { type: MediaType.Image, url: smallImage },
});

const containerStyles = css({
	margin: '1rem 0',
	width: '300px',
});
const overrideCss = css({
	backgroundColor: token('color.background.accent.blue.subtle', '#579DFF'),
	borderRadius: '0.5rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> img': {
		objectFit: 'contain',
	},
});

export default () => {
	if (!fg('bandicoots-compiled-migration-smartcard')) {
		return <Old />;
	}
	return (
		<VRTestWrapper>
			<FlexibleUiContext.Provider value={context}>
				<h5>Media type: Image</h5>
				<div css={containerStyles}>
					<Preview testId="vr-test-media" />
				</div>
				<div css={containerStyles}>
					<Preview overrideUrl={wideImage} />
				</div>
				<h5>Override CSS</h5>
				<div css={containerStyles}>
					<Preview css={overrideCss} />
				</div>
			</FlexibleUiContext.Provider>
		</VRTestWrapper>
	);
};
