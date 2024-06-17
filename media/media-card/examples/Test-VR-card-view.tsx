/**@jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
// eslint-disable-line no-console
import React from 'react';
import { type CardStatus } from '../src';
import { CardView } from '../src/card/cardView';
import { CardViews } from '../src/card/v2/cardviews';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { type FileDetails, type MediaType } from '@atlaskit/media-client';
import { tallImage, wideTransparentImage } from '@atlaskit/media-test-helpers';
import { token } from '@atlaskit/tokens';
import { IntlProvider } from 'react-intl-next';
import { MainWrapper, mediaCardErrorState } from '../example-helpers';
import { CardViewWrapper } from '../example-helpers/cardViewWrapper';

const dimensions = { width: '100%', height: '100%' };

const styledContainerStyles = css({
	maxWidth: '800px',
	margin: `${token('space.250', '20px')} auto`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h3: {
		textAlign: 'center',
	},
});

const mimeTypes: { media: MediaType; mime: string; name: string }[] = [
	{ media: 'doc', mime: 'application/pdf', name: '.pdf' },
	{ media: 'image', mime: 'image/png', name: '.img' },
	{ media: 'video', mime: 'video/mp4', name: '.video' },
	{ media: 'audio', mime: 'audio/mp3', name: '.audio' },
	{ media: 'archive', mime: 'application/zip', name: '.zip' },
	{ media: 'unknown', mime: 'unknown', name: '.unknown' },
];

const IconsTable = () => {
	return (
		<MainWrapper disableFeatureFlagWrapper={true} developmentOnly>
			<div css={styledContainerStyles}>
				{/* Reference page:
        https://hello.atlassian.net/wiki/spaces/~231281387/pages/910276304/Visual+Regression+Tests+MediaCard
        for what we test for, in terms of Visual regressions in MediaCard */}
				{/* TODO: remove this IntlProvider https://product-fabric.atlassian.net/browse/BMPT-139 */}
				<IntlProvider locale={'en'}>
					<React.Fragment>
						{mimeTypes.map((item, i) =>
							renderCardImageView('complete', item.media, item.mime, item.name, i),
						)}
					</React.Fragment>
				</IntlProvider>
			</div>
		</MainWrapper>
	);
};

const LoadedCardView = getBooleanFF('platform.media-experience.card-views-refactor_b91lr')
	? CardViews
	: CardView;

function renderCardImageView(
	status: CardStatus,
	mediaType: MediaType,
	mimeType: any,
	name: string,
	key: number,
) {
	const urlParams = new URLSearchParams(window.location.search);
	const cardStatus = urlParams.get('status') as CardStatus;
	const metadata: FileDetails | undefined =
		urlParams.get('disableMetadata') === 'true'
			? undefined
			: {
					id: 'some-file-id',
					name,
					mediaType: mediaType,
					mimeType,
					size: 4200,
					createdAt: 1589481162745,
				};
	const isDataURIBroken = urlParams.get('brokenDataUri') === 'true';
	const isTransparentImage = urlParams.get('isTransparent') === 'true';
	const resizeMode = isTransparentImage ? 'fit' : 'crop';
	const dataURI = isDataURIBroken
		? 'error-uri'
		: isTransparentImage
			? wideTransparentImage
			: urlParams.get('dataUri') === 'true'
				? tallImage
				: undefined;
	const selected = urlParams.get('selected') === 'true';
	const isRateLimited = urlParams.get('isRateLimited') === 'true';
	const isPollingError = urlParams.get('isPollingMaxAttemptsExceeded') === 'true';
	const disableOverlay = urlParams.get('disableOverlay') === 'true';
	const isUploadError = urlParams.get('isUploadError') === 'true';
	const error = isRateLimited
		? 'rateLimitedError'
		: isPollingError
			? 'pollingMaxAttemptsError'
			: isUploadError
				? 'uploadError'
				: undefined;
	const width = urlParams.get('width');
	if (width) {
		dimensions.width = width;
	}

	const cardPreview = dataURI ? ({ dataURI, source: 'remote' } as const) : undefined;

	return (
		<CardViewWrapper small={true} displayInline={true} key={key}>
			<LoadedCardView
				error={mediaCardErrorState(error)}
				disableOverlay={disableOverlay}
				status={cardStatus || status}
				mediaItemType="file"
				metadata={metadata}
				resizeMode={resizeMode}
				progress={0.5}
				dimensions={dimensions}
				cardPreview={cardPreview}
				selected={selected}
				disableAnimation={true}
			/>
		</CardViewWrapper>
	);
}
export default () => <IconsTable />;
