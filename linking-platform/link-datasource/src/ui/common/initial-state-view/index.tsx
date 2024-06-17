/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage, type MessageDescriptor, useIntl } from 'react-intl-next';

import Lozenge from '@atlaskit/lozenge';
import { N300 } from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { initialStateViewMessages } from './messages';

const initialStateViewContainerStyles = css({
	display: 'flex',
	justifyContent: 'center',
	height: '100%',
});

const svgAndTextsWrapperStyles = css({
	textAlign: 'center',
	alignSelf: 'center',
	paddingTop: token('space.600', '48px'),
	paddingBottom: token('space.600', '48px'),
});

const betaTagStyles = css({
	display: 'flex',
});

const searchTitleStyles = css({
	color: token('color.text.subtlest', N300),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.heading.medium', fontFallback.heading.medium),
	paddingTop: token('space.200', '16px'),
	paddingBottom: token('space.100', '8px'),
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	gap: token('space.100', '8px'),
});

const mainTextStyles = css({
	color: token('color.text.subtlest', N300),
});

const learnMoreLinkStyles = css({
	paddingTop: token('space.200', '16px'),
	display: 'inline-block',
});

interface InitialStateViewProps {
	icon: JSX.Element;
	showBeta?: boolean;
	title: MessageDescriptor;
	description: MessageDescriptor;
	learnMoreLink?: { href: string; text: MessageDescriptor };
}

export const InitialStateView = ({
	icon,
	showBeta = false,
	title,
	description,
	learnMoreLink,
}: InitialStateViewProps) => {
	const { formatMessage } = useIntl();
	return (
		<div css={initialStateViewContainerStyles} data-testid="datasource-modal--initial-state-view">
			<div css={svgAndTextsWrapperStyles}>
				{icon}
				<div css={searchTitleStyles}>
					{showBeta && (
						<div css={betaTagStyles}>
							<Lozenge appearance="new">
								<FormattedMessage {...initialStateViewMessages.beta} />
							</Lozenge>
						</div>
					)}
					{formatMessage(title)}
				</div>
				<div css={mainTextStyles}>{formatMessage(description)}</div>
				{learnMoreLink && (
					<a href={learnMoreLink.href} target="_blank" css={learnMoreLinkStyles}>
						{formatMessage(learnMoreLink.text)}
					</a>
				)}
			</div>
		</div>
	);
};
