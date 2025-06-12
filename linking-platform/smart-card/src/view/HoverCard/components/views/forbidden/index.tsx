/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import ButtonOld from '@atlaskit/button';
import Button from '@atlaskit/button/new';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { SmartLinkStatus } from '../../../../../constants';
import { extractRequestAccessContextImproved } from '../../../../../extractors/common/context/extractAccessContext';
import extractHostname from '../../../../../extractors/common/hostname/extractHostname';
import { messages } from '../../../../../messages';
import FlexibleCard from '../../../../FlexibleCard';
import { CustomBlock, PreviewBlock } from '../../../../FlexibleCard/components/blocks';

import { type HoverCardForbiddenProps } from './types';

const titleBlockStylesOld = css({
	justifyContent: 'center',
	fontWeight: token('font.weight.semibold'),
	marginTop: token('space.100', '8px'),
});

const titleBlockStyles = css({
	justifyContent: 'center',
	fontWeight: token('font.weight.semibold'),
	marginTop: token('space.100'),
});

const mainTextStylesOld = css({
	display: 'inline',
	justifyContent: 'center',
	marginTop: token('space.0', '0px'),
	font: token('font.body.UNSAFE_small'),
	textAlign: 'center',
});

const mainTextStyles = css({
	display: 'inline',
	justifyContent: 'center',
	marginTop: token('space.0'),
	font: token('font.body.UNSAFE_small'),
	textAlign: 'center',
});

const connectButtonStylesOld = css({
	justifyContent: 'center',
	marginTop: token('space.100', '8px'),
});

const connectButtonStyles = css({
	justifyContent: 'center',
	marginTop: token('space.100'),
});

const basePreviewStylesOld = css({
	borderTopLeftRadius: token('border.radius.200', '8px'),
	borderTopRightRadius: token('border.radius.200', '8px'),
	marginBottom: token('space.100', '0.5rem'),
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

	const ButtonComponent = fg('platform-smart-card-remove-legacy-button') ? Button : ButtonOld;
	return (
		<FlexibleCard {...flexibleCardProps} testId={testId}>
			<PreviewBlock
				ignoreContainerPadding={true}
				css={[fg('platform-linking-visual-refresh-v1') ? basePreviewStyles : basePreviewStylesOld]}
				testId={testId}
				{...(fg('platform-linking-flexible-card-context')
					? undefined
					: { status: SmartLinkStatus.Forbidden })}
			/>
			<CustomBlock
				css={[fg('platform-linking-visual-refresh-v1') ? titleBlockStyles : titleBlockStylesOld]}
				testId={`${testId}-title`}
				{...(fg('platform-linking-flexible-card-context')
					? undefined
					: { status: SmartLinkStatus.Forbidden })}
			>
				<FormattedMessage {...messages[titleMessageKey]} values={{ product }} />
			</CustomBlock>
			<CustomBlock
				css={[fg('platform-linking-visual-refresh-v1') ? mainTextStyles : mainTextStylesOld]}
				testId={`${testId}-content`}
				{...(fg('platform-linking-flexible-card-context')
					? undefined
					: { status: SmartLinkStatus.Forbidden })}
			>
				<FormattedMessage {...messages[descriptiveMessageKey]} values={{ product, hostname }} />
			</CustomBlock>

			{action && (
				<CustomBlock
					css={[
						fg('platform-linking-visual-refresh-v1') ? connectButtonStyles : connectButtonStylesOld,
					]}
					{...(fg('platform-linking-flexible-card-context')
						? undefined
						: { status: SmartLinkStatus.Forbidden })}
				>
					<ButtonComponent
						testId={`${testId}-button`}
						onClick={action?.promise}
						appearance="primary"
						isDisabled={buttonDisabled}
					>
						{action?.text}
					</ButtonComponent>
				</CustomBlock>
			)}
		</FlexibleCard>
	);
};

export default HoverCardForbiddenView;
