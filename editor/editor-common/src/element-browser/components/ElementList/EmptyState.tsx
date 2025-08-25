/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { LinkButton } from '@atlaskit/button/new';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import NotFoundIllustration from './NotFoundIllustration';

type Props = {
	focusOnEmptyStateButton?: boolean;
	onExternalLinkClick: () => void;
};

export default function EmptyState({
	onExternalLinkClick,
	focusOnEmptyStateButton,
}: Props): JSX.Element {
	const buttonRef = useRef<HTMLAnchorElement | null>(null);

	useEffect(() => {
		if (focusOnEmptyStateButton && buttonRef.current) {
			buttonRef.current.focus();
		}
	}, [focusOnEmptyStateButton]);

	return (
		<div css={emptyStateWrapper} data-testid="empty-state-wrapper">
			<NotFoundIllustration />
			<div css={emptyStateHeading}>
				<FormattedMessage
					id="fabric.editor.elementbrowser.search.empty-state.heading"
					defaultMessage="Nothing matches your search"
					description="Empty state heading"
				/>
			</div>
			<div css={emptyStateSubHeading}>
				<Text>
					<FormattedMessage
						id="fabric.editor.elementbrowser.search.empty-state.sub-heading"
						defaultMessage="Try searching with a different term or discover new apps for Atlassian products."
						description="Empty state sub-heading"
					/>
				</Text>
				<Box xcss={externalLinkWrapper}>
					<LinkButton
						appearance="primary"
						target="_blank"
						ref={buttonRef}
						href="https://marketplace.atlassian.com/search?category=Macros&hosting=cloud&product=confluence"
						onClick={onExternalLinkClick}
					>
						<FormattedMessage
							id="fabric.editor.elementbrowser.search.empty-state.sub-heading.link"
							defaultMessage="Explore Atlassian Marketplace"
							description="Empty state sub-heading external link"
						/>
					</LinkButton>
				</Box>
			</div>
		</div>
	);
}

const emptyStateHeading = css({
	font: token('font.heading.medium'),
	color: token('color.text', 'rgb(23, 43, 77)'),
	marginTop: token('space.300', '24px'),
});

const emptyStateSubHeading = css({
	marginTop: token('space.200', '16px'),
	maxWidth: '400px',
	textAlign: 'center',
});

const emptyStateWrapper = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	width: '100%',
});

const externalLinkWrapper = xcss({
	marginTop: 'space.150',
});
