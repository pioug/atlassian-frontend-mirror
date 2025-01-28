/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { smallImage, wideImage } from '@atlaskit/media-test-helpers';

import { MediaType } from '../../src/constants';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { Preview } from '../../src/view/FlexibleCard/components/elements';
import { exampleTokens, getContext } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
	preview: { type: MediaType.Image, url: smallImage },
});

const containerStyles = css({
	margin: '1rem 0',
	width: '300px',
});
const overrideCss = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: exampleTokens.overrideColor,
	borderRadius: '0.5rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> img': {
		objectFit: 'contain',
	},
});

const Old = () => (
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
				<Preview overrideCss={overrideCss} />
			</div>
		</FlexibleUiContext.Provider>
	</VRTestWrapper>
);

export default Old;
