/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/new';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { token } from '@atlaskit/tokens';

import { extractRequestAccessContextImproved } from '../../../../../extractors/common/context/extractAccessContext';
import extractHostname from '../../../../../extractors/common/hostname/extractHostname';
import { messages } from '../../../../../messages';
import FlexibleCard from '../../../../FlexibleCard';
import { CustomBlock, PreviewBlock } from '../../../../FlexibleCard/components/blocks';

import { type HoverCardForbiddenProps } from './types';

const titleBlockStyles = css({
	justifyContent: 'center',
	fontWeight: token('font.weight.semibold'),
	marginTop: token('space.100'),
});

const mainTextStyles = css({
	display: 'inline',
	justifyContent: 'center',
	marginTop: token('space.0'),
	font: token('font.body.UNSAFE_small'),
	textAlign: 'center',
});

const connectButtonStyles = css({
	justifyContent: 'center',
	marginTop: token('space.100'),
});

const basePreviewStyles = css({
	borderTopLeftRadius: token('border.radius.200'),
	borderTopRightRadius: token('border.radius.200'),
	marginBottom: token('space.100'),
});

const HoverCardForbiddenView = ({
	flexibleCardProps,
	testId = 'hover-card-forbidden-view',
}: HoverCardForbiddenProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { cardState, url } = flexibleCardProps;
	const meta = cardState.details?.meta as JsonLd.Meta.BaseMeta;
	const product = extractSmartLinkProvider(cardState.details)?.text ?? '';
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
			<PreviewBlock ignoreContainerPadding={true} css={[basePreviewStyles]} testId={testId} />
			<CustomBlock css={[titleBlockStyles]} testId={`${testId}-title`}>
				<FormattedMessage {...messages[titleMessageKey]} values={{ product }} />
			</CustomBlock>
			<CustomBlock css={[mainTextStyles]} testId={`${testId}-content`}>
				<FormattedMessage {...messages[descriptiveMessageKey]} values={{ product, hostname }} />
			</CustomBlock>

			{action && (
				<CustomBlock css={[connectButtonStyles]}>
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
