/**@jsx jsx */
import { css, jsx } from '@emotion/react';
import { InlinePlayer } from '../src/card/inlinePlayer';
import { createStorybookMediaClient, videoSquareFileId } from '@atlaskit/media-test-helpers';
import { createMediaSubscribable } from '@atlaskit/media-client';
import { token } from '@atlaskit/tokens';

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
		width: width,
		height: height,
		margin: `${token('space.250', '20px')} ${token('space.250', '20px')}`,
	});

export default () => {
	const urlParams = new URLSearchParams(window.location.search);
	const cardStatus = urlParams.get('status') as any;

	const mediaClient = createStorybookMediaClient();

	mediaClient.file.getFileState = () => {
		return createMediaSubscribable({
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
		});
	};

	return (
		<MainWrapper disableFeatureFlagWrapper={true} developmentOnly>
			<IntlProvider locale={'en'}>
				<div css={inlinePlayerWrapperStyles({ ...wrapperDimensions })}>
					<InlinePlayer
						identifier={videoSquareFileId}
						mediaClient={mediaClient}
						dimensions={dimensions}
						// needed for reliable snapshots
						selected={true}
						autoplay={false}
					/>
				</div>
			</IntlProvider>
		</MainWrapper>
	);
};
