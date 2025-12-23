/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React from 'react';
import { type CardStatus } from '../src';
import { CardView } from '../src/card/cardView';
import { type FileDetails, type MediaType } from '@atlaskit/media-client';
import { token } from '@atlaskit/tokens';
import { IntlProvider } from 'react-intl-next';
import { MainWrapper } from '../example-helpers';
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

const mimeTypes: { mime: string; name: string }[] = [
	{ mime: 'application/pdf', name: '.pdf' },
	{
		mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		name: '.excel',
	},
	{ mime: 'image/gif', name: '.gif' },
	{ mime: 'application/vnd.ms-powerpoint', name: '.powerpoint' },
	{ mime: 'application/msword', name: '.wordDoc' },
	{ mime: 'binary/octet-stream', name: '.sketch' },
	{ mime: 'application/octet-stream', name: '.fig' },
	{ mime: 'binary/octet-stream', name: '.exe' },
	{ mime: 'application/vnd.google-apps.document', name: '.google-docs' },
	{
		mime: 'application/vnd.google-apps.presentation',
		name: '.google-slides',
	},
	{
		mime: 'application/vnd.google-apps.spreadsheet',
		name: '.google-sheets',
	},
	{ mime: 'application/vnd.google-apps.form', name: '.google-form' },
	{ mime: 'text/csv', name: '.csv' },
	{ mime: 'application/x-iwork-keynote-sffkey', name: '.presentation' },
	{ mime: 'text/plain', name: '.source-code.c' },
];

const IconsTable = () => {
	return (
		<div css={styledContainerStyles}>
			<h3>MimeTypes</h3>
			{/* TODO: remove this IntlProvider https://product-fabric.atlassian.net/browse/BMPT-139 */}
			<IntlProvider locale={'en'}>
				<React.Fragment>
					{mimeTypes.map((item, i) =>
						renderCardImageView('complete', 'audio', item.mime, item.name, i),
					)}
				</React.Fragment>
			</IntlProvider>
		</div>
	);
};

function renderCardImageView(
	status: CardStatus,
	mediaType: MediaType = 'image',
	mimeType: any,
	name: string,
	key: number,
) {
	const metadata: FileDetails = {
		id: 'some-file-id',
		name,
		mediaType,
		mimeType,
		size: 4200,
		createdAt: 1589481162745,
	};

	return (
		<MainWrapper key={key}>
			<CardViewWrapper small={true} displayInline={true}>
				<CardView
					status={status}
					mediaItemType="file"
					metadata={metadata}
					resizeMode="crop"
					progress={0.5}
					dimensions={dimensions}
					identifier={{
						id: 'some-file-id',
						collectionName: 'some-collection-name',
						mediaItemType: 'file',
					}}
				/>
			</CardViewWrapper>
		</MainWrapper>
	);
}
export default (): React.JSX.Element => <IconsTable />;
