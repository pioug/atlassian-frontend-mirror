import React from 'react';
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import { Provider, Card, Client } from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const InheritDimensionWrapper = styled.div({
	height: '300px',
	'.loader-wrapper': {
		height: '100%',
	},
});

export default () => (
	<Provider client={new Client('stg')}>
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '680px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				margin: '0 auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginTop: token('space.800', '64px'),
			}}
		>
			<h2> Resolved Embed Card view </h2>
			<br />
			<Card appearance="embed" url="https://www.youtube.com/watch?v=jmvngQzy_3M" platform="web" />
			<h2> Resolved Embed Card view with interactiveHref</h2>
			<Card
				appearance="embed"
				url="https://docs.google.com/document/d/1qZ74vupNf8bxMJqONtgrqtpqeJAe9OJ1d1Jo2CTpS_4/edit"
				platform="web"
				embedIframeUrlType="interactiveHref"
			/>
			<h2> Resolved Embed Card view with "inheritDimensions" = 'true' prop & height of 300px </h2>
			<br />
			<InheritDimensionWrapper>
				<Card
					appearance="embed"
					url="https://www.youtube.com/watch?v=jmvngQzy_3M"
					inheritDimensions={true}
					platform="web"
				/>
			</InheritDimensionWrapper>
			<h2> Not Found Embed Card view - random URL </h2>
			<br />
			<Card
				appearance="embed"
				url="https://www.dropbox.com/sh/0000isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0"
			/>
			<h2> Unauthorised Embed card view </h2>
			<br />
			<Card
				appearance="embed"
				url="https://www.dropbox.com/sh/0000isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0"
			/>
		</div>
	</Provider>
);
