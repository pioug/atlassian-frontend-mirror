import React from 'react';

import { type JsonLd } from 'json-ld-types';
import { FormattedMessage } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import { extractProvider } from '@atlaskit/link-extractors';

import { extractRequestAccessContextImproved } from '../../../../../extractors/common/context/extractAccessContext';
import extractHostname from '../../../../../extractors/common/hostname/extractHostname';
import { messages } from '../../../../../messages';
import FlexibleCard from '../../../../FlexibleCard';
import { CustomBlock, PreviewBlock } from '../../../../FlexibleCard/components/blocks';
import { getPreviewBlockStyles } from '../../../styled';

import { connectButtonStyles, mainTextStyles, titleBlockStyles } from './styled';
import { type HoverCardForbiddenProps } from './types';



const HoverCardForbiddenView = ({
	flexibleCardProps,
	testId = 'hover-card-forbidden-view',
}: HoverCardForbiddenProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { cardState, url } = flexibleCardProps;
	const data = cardState.details?.data as JsonLd.Data.BaseData;
	const meta = cardState.details?.meta as JsonLd.Meta.BaseMeta;
	const product = extractProvider(data)?.text ?? '';
	const hostname = <b>{extractHostname(url)}</b>;

	const { action, descriptiveMessageKey, titleMessageKey, buttonDisabled } =
		extractRequestAccessContextImproved({
			jsonLd: meta,
			url,
			product,
			createAnalyticsEvent,
		}) ?? {};

	if (!titleMessageKey || !descriptiveMessageKey) {
		return null;
	}

	return (
		<FlexibleCard {...flexibleCardProps} testId={testId}>
			<PreviewBlock
				ignoreContainerPadding={true}
				overrideCss={getPreviewBlockStyles()}
				testId={testId}
			/>
			<CustomBlock overrideCss={titleBlockStyles} testId={`${testId}-title`}>
				<FormattedMessage {...messages[titleMessageKey]} values={{ product }} />
			</CustomBlock>
			<CustomBlock overrideCss={mainTextStyles} testId={`${testId}-content`}>
				<FormattedMessage {...messages[descriptiveMessageKey]} values={{ product, hostname }} />
			</CustomBlock>

			{action && (
				<CustomBlock overrideCss={connectButtonStyles}>
					<Button
						testId={`${testId}-button`}
						onClick={action?.promise}
						appearance="primary"
						isDisabled={buttonDisabled}
					>
						{action?.text}
					</Button>
				</CustomBlock>
			)}
		</FlexibleCard>
	);
};

export default HoverCardForbiddenView;
