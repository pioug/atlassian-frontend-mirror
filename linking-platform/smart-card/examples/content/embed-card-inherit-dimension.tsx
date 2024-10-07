/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient, ResolvedClientEmbedUrl } from '../../examples/utils/custom-client';
import { Card } from '../../src';

const containerStyles = css({
	height: '300px',
	width: '300px',
	margin: '0 auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.loader-wrapper': {
		height: '100%',
	},
});

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<div css={containerStyles}>
			<Card
				appearance="embed"
				frameStyle="show"
				inheritDimensions={true}
				platform="web"
				url={ResolvedClientEmbedUrl}
			/>
		</div>
	</SmartCardProvider>
);
