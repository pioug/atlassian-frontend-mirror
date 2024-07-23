/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { InlinePlayer } from '../src/card/inlinePlayer';
import { createStorybookMediaClient, videoSquareFileId } from '@atlaskit/media-test-helpers';
import { token } from '@atlaskit/tokens';
import { MediaClientContext } from '@atlaskit/media-client-react';

import { IntlProvider } from 'react-intl-next';
import { MainWrapper } from '../example-helpers';

type WrapperDimensions = {
	width: string;
	height: string;
};
const wrapperDimensions = { width: '500px', height: '500px' };
const dimensions = { width: '100%', height: '100%' };

const inlinePlayerWrapperStyles = ({ width, height }: WrapperDimensions) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: width,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: height,
		margin: `${token('space.250', '20px')} ${token('space.250', '20px')}`,
	});

export default () => {
	const urlParams = new URLSearchParams(window.location.search);
	const cardStatus = urlParams.get('status') as any;

	const mediaClient = createStorybookMediaClient();

	mediaClient.__DO_NOT_USE__getMediaStore().setState({
		files: {
			[videoSquareFileId.id]: {
				status: cardStatus,
				preview: {
					value: new Blob([], { type: 'video/mp4' }),
				},
				id: '',
				mediaType: 'image',
				mimeType: '',
				name: '',
				progress: 0.5,
				size: 0,
			},
		},
	});

	return (
		<MainWrapper disableFeatureFlagWrapper={true} developmentOnly>
			<MediaClientContext.Provider value={mediaClient}>
				<IntlProvider locale={'en'}>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={inlinePlayerWrapperStyles({ ...wrapperDimensions })}>
						<InlinePlayer
							identifier={videoSquareFileId}
							dimensions={dimensions}
							// needed for reliable snapshots
							selected={true}
							autoplay={false}
						/>
					</div>
				</IntlProvider>
			</MediaClientContext.Provider>
		</MainWrapper>
	);
};
