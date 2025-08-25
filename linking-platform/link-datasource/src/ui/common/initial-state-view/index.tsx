/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { FormattedMessage, type MessageDescriptor, useIntl } from 'react-intl-next';

import Link from '@atlaskit/link';
import Lozenge from '@atlaskit/lozenge';
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
	color: token('color.text'),
	font: token('font.heading.medium'),
	paddingTop: token('space.300', '24px'),
	paddingBottom: token('space.200', '16px'),
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	gap: token('space.100', '8px'),
});

const mainTextStyles = css({
	color: token('color.text.subtle', '#44546F'),
});

interface InitialStateViewProps {
	description: MessageDescriptor;
	icon: JSX.Element;
	learnMoreLink?: { href: string; text: MessageDescriptor };
	showBeta?: boolean;
	title: MessageDescriptor;
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
				<div css={[searchTitleStyles]}>
					{showBeta && (
						<div css={betaTagStyles}>
							<Lozenge appearance="new">
								<FormattedMessage {...initialStateViewMessages.beta} />
							</Lozenge>
						</div>
					)}
					{formatMessage(title)}
				</div>
				<div css={[mainTextStyles]}>{formatMessage(description)}</div>
				{learnMoreLink ? (
					<Link href={learnMoreLink.href} target="_blank">
						{formatMessage(learnMoreLink.text)}
					</Link>
				) : null}
			</div>
		</div>
	);
};
