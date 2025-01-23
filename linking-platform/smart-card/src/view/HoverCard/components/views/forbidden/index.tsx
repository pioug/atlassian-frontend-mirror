/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { type JsonLd } from 'json-ld-types';
import { FormattedMessage } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import { extractProvider } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { SmartLinkStatus } from '../../../../../constants';
import { extractRequestAccessContextImproved } from '../../../../../extractors/common/context/extractAccessContext';
import extractHostname from '../../../../../extractors/common/hostname/extractHostname';
import { messages } from '../../../../../messages';
import FlexibleCard from '../../../../FlexibleCard';
import { CustomBlock, PreviewBlock } from '../../../../FlexibleCard/components/blocks';

import HoverCardForbiddenViewOld from './HoverCardForbiddenViewOld';
import { type HoverCardForbiddenProps } from './types';

const titleBlockStyles = css({
	justifyContent: 'center',
	fontWeight: token('font.weight.semibold'),
	marginTop: token('space.100', '8px'),
});

const mainTextStyles = css({
	display: 'inline',
	justifyContent: 'center',
	marginTop: token('space.0', '0px'),
	font: token('font.body.UNSAFE_small'),
	textAlign: 'center',
});

const connectButtonStyles = css({
	justifyContent: 'center',
	marginTop: token('space.100', '8px'),
});

const basePreviewStyles = css({
	borderTopLeftRadius: token('border.radius.200', '8px'),
	borderTopRightRadius: token('border.radius.200', '8px'),
	marginBottom: token('space.100', '0.5rem'),
});

const HoverCardForbiddenViewNew = ({
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
				css={[basePreviewStyles]}
				testId={testId}
				status={SmartLinkStatus.Forbidden}
			/>
			<CustomBlock
				css={titleBlockStyles}
				testId={`${testId}-title`}
				status={SmartLinkStatus.Forbidden}
			>
				<FormattedMessage {...messages[titleMessageKey]} values={{ product }} />
			</CustomBlock>
			<CustomBlock
				css={mainTextStyles}
				testId={`${testId}-content`}
				status={SmartLinkStatus.Forbidden}
			>
				<FormattedMessage {...messages[descriptiveMessageKey]} values={{ product, hostname }} />
			</CustomBlock>

			{action && (
				<CustomBlock css={connectButtonStyles} status={SmartLinkStatus.Forbidden}>
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

const HoverCardForbiddenView = (props: HoverCardForbiddenProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <HoverCardForbiddenViewNew {...props} />;
	} else {
		return <HoverCardForbiddenViewOld {...props} />;
	}
};

export default HoverCardForbiddenView;
