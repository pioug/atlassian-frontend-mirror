/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React from 'react';
import { createStorybookMediaClientConfig, genericFileId } from '@atlaskit/media-test-helpers';
import { Card } from '../src';
import { MainWrapper } from '../example-helpers';

const dimensions = { width: 500, height: 400 };

const cardWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${dimensions.width}px`,
	margin: 'auto',
});
const dummyContentStyles = css({
	height: '300vh',
});

const mediaClientConfig = createStorybookMediaClientConfig();

class Example extends React.Component<{}, {}> {
	render() {
		return (
			<MainWrapper>
				<div css={dummyContentStyles}>
					<h3>Scroll down to see Card loading once it hits the viewport</h3>
				</div>
				<div css={cardWrapperStyles}>
					<Card
						mediaClientConfig={mediaClientConfig}
						identifier={genericFileId}
						disableOverlay={true}
						dimensions={dimensions}
					/>
				</div>
			</MainWrapper>
		);
	}
}

export default () => <Example />;
