/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Link from '@atlaskit/link';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { Card } from '../../../src';

const containerStyles = css({
	height: '85vh',
	width: '100%',
	margin: '0 auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.loader-wrapper': {
		height: '100%',
	},
});

const url = 'https://hello.atlassian.net/wiki/spaces/TWPLP/pages/4448067142';

const FallbackComponent = () => (
	<Link href={url} target="_blank">
		Go to Linking Platform FAQ
	</Link>
);

export default () => (
	<SmartCardProvider>
		<div css={containerStyles}>
			<Card
				appearance="embed"
				fallbackComponent={FallbackComponent}
				frameStyle="hide"
				inheritDimensions={true}
				platform="web"
				url={url}
			/>
		</div>
	</SmartCardProvider>
);
