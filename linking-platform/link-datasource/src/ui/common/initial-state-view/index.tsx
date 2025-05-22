/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { FormattedMessage, type MessageDescriptor, useIntl } from 'react-intl-next';

import Link from '@atlaskit/link';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
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

const searchTitleStylesOld = css({
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

const searchTitleStyles = css({
	color: token('color.text'),
	font: token('font.heading.medium'),
	paddingTop: token('space.300', '24px'),
	paddingBottom: token('space.200', '16px'),
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	gap: token('space.100', '8px'),
});

const mainTextStylesOld = css({
	color: token('color.text.subtlest', N300),
});

const mainTextStyles = css({
	color: token('color.text.subtle', '#44546F'),
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
				<div
					css={[
						fg('platform-linking-visual-refresh-sllv') ? searchTitleStyles : searchTitleStylesOld,
					]}
				>
					{showBeta && (
						<div css={betaTagStyles}>
							<Lozenge appearance="new">
								<FormattedMessage {...initialStateViewMessages.beta} />
							</Lozenge>
						</div>
					)}
					{formatMessage(title)}
				</div>
				<div
					css={[fg('platform-linking-visual-refresh-sllv') ? mainTextStyles : mainTextStylesOld]}
				>
					{formatMessage(description)}
				</div>
				{learnMoreLink ? (
					fg('platform-linking-visual-refresh-sllv') ? (
						<Link href={learnMoreLink.href} target="_blank">
							{formatMessage(learnMoreLink.text)}
						</Link>
					) : (
						// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
						<a href={learnMoreLink.href} target="_blank" css={learnMoreLinkStyles}>
							{formatMessage(learnMoreLink.text)}
						</a>
					)
				) : null}
			</div>
		</div>
	);
};
