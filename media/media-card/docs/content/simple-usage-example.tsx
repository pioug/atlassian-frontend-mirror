/**@jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React from 'react';
import {
	defaultCollectionName,
	genericFileId,
	videoFileId,
	createUploadMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { type FileIdentifier } from '@atlaskit/media-client';
import { Card } from '../../src';
import { cardWrapperStyles } from '../../example-helpers/styles';
import { MainWrapper } from '../../example-helpers';

const mediaClientConfig = createUploadMediaClientConfig();

const fileIds = [
	{ id: genericFileId.id, name: 'Generic file' },
	{ id: videoFileId.id, name: 'Video file' },
];

const Example = () => {
	const renderCards = () => {
		const cards = fileIds.map(({ id, name }) => {
			const identifier: FileIdentifier = {
				id,
				mediaItemType: 'file',
				collectionName: defaultCollectionName,
			};
			return (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<div css={cardWrapperStyles} key={id}>
					<div>
						<h3>{name}</h3>
						<Card mediaClientConfig={mediaClientConfig} identifier={identifier} />
					</div>
				</div>
			);
		});
		return cards;
	};

	return <React.Fragment>{renderCards()}</React.Fragment>;
};

export default () => (
	<MainWrapper>
		<Example />
	</MainWrapper>
);
