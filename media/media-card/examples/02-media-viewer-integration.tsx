/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { Component } from 'react';
import { Card } from '../src';
import {
	createStorybookMediaClientConfig,
	imageFileId,
	gifFileId,
	videoFileId,
	largeImageFileId,
} from '@atlaskit/media-test-helpers';

import {
	mediaViewerExampleWrapperStyles,
	mediaViewerExampleColumnStyles,
} from '../example-helpers/styles';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();
const mediaViewerItems = [imageFileId, gifFileId, largeImageFileId, videoFileId];

interface ExampleState {
	shouldOpenMediaViewer: boolean;
}

class Example extends Component<{}, {}> {
	state: ExampleState = {
		shouldOpenMediaViewer: true,
	};

	render() {
		const { shouldOpenMediaViewer } = this.state;

		return (
			<MainWrapper>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<div css={mediaViewerExampleWrapperStyles}>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={mediaViewerExampleColumnStyles}>
						<h3>shouldOpenMediaViewer + mediaViewerItems</h3>
						<Card
							mediaClientConfig={mediaClientConfig}
							identifier={imageFileId}
							shouldOpenMediaViewer={shouldOpenMediaViewer}
							mediaViewerItems={mediaViewerItems}
						/>
						<Card
							mediaClientConfig={mediaClientConfig}
							identifier={gifFileId}
							shouldOpenMediaViewer={shouldOpenMediaViewer}
							mediaViewerItems={mediaViewerItems}
						/>
						<Card
							mediaClientConfig={mediaClientConfig}
							identifier={videoFileId}
							shouldOpenMediaViewer={shouldOpenMediaViewer}
							mediaViewerItems={mediaViewerItems}
						/>
					</div>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={mediaViewerExampleColumnStyles}>
						<h3>shouldOpenMediaViewer + list without card identifier</h3>
						<Card
							mediaClientConfig={mediaClientConfig}
							identifier={imageFileId}
							shouldOpenMediaViewer={shouldOpenMediaViewer}
							mediaViewerItems={[gifFileId]}
						/>
					</div>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={mediaViewerExampleColumnStyles}>
						<h3>useInlinePlayer=true</h3>
						<Card
							mediaClientConfig={mediaClientConfig}
							identifier={videoFileId}
							shouldOpenMediaViewer={shouldOpenMediaViewer}
							mediaViewerItems={mediaViewerItems}
							useInlinePlayer={true}
						/>
					</div>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={mediaViewerExampleColumnStyles}>
						<h3>mediaViewerItems=undefined</h3>
						<Card
							mediaClientConfig={mediaClientConfig}
							identifier={largeImageFileId}
							shouldOpenMediaViewer={shouldOpenMediaViewer}
						/>
					</div>
				</div>
			</MainWrapper>
		);
	}
}

export default () => <Example />;
