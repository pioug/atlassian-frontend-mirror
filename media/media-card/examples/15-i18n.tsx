/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	externaBrokenlIdentifier,
	errorFileId,
	largePdfFileId,
	imageFileId,
} from '@atlaskit/media-test-helpers/exampleMediaItems';
import { I18NWrapper } from '@atlaskit/media-test-helpers/I18nWrapper';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers/mediaClientProvider';
import { token } from '@atlaskit/tokens';

import { MainWrapper } from '../example-helpers';
import Card from '../src/card/cardLoader';

const mediaClientConfig = createStorybookMediaClientConfig();

const wrapperStyles = css({
	maxWidth: '800px',
	margin: `${token('space.250')} auto`,
});

const cardContainerStyles = css({
	display: 'inline-block',
	marginRight: token('space.250'),
	marginTop: token('space.250'),
});

const cardDimensions = [
	{ width: '156px', height: '108px' },
	{ width: '600px', height: '150px' },
];

const fileIds = [errorFileId, externaBrokenlIdentifier, largePdfFileId, imageFileId];

export default (): React.JSX.Element => {
	return (
		<div css={wrapperStyles}>
			<I18NWrapper>
				<MainWrapper>
					{fileIds.map((fileId, fileIdIndex) =>
						cardDimensions.map((dimensions, dimensionIndex) => (
							<div css={cardContainerStyles} key={`${dimensionIndex}${fileIdIndex}`}>
								<Card
									identifier={fileId}
									mediaClientConfig={mediaClientConfig}
									dimensions={dimensions}
								/>
							</div>
						)),
					)}
				</MainWrapper>
			</I18NWrapper>
		</div>
	);
};
