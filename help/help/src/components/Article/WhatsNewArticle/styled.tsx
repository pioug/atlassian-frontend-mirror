/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';


export const WhatsNewTypeTitle = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<Heading size="xsmall" as="h3">
		{children}
	</Heading>
);

const whatsNewIconContainerStyles = css({
	display: 'flex',
	gap: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
});

export const WhatsNewIconContainer = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={whatsNewIconContainerStyles}>{children}</div>
);


export const WhatsNewTitleText = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<Heading size="xsmall" as="h4">
		{children}
	</Heading>
);

const relatedLinkContainerStyles = css({
	marginBottom: token('space.100', '8px'),
});

export const RelatedLinkContainer = ({ children }: { children: React.ReactNode }): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={relatedLinkContainerStyles}>{children}</div>
);

const externalLinkIconContainerStyles = css({
	display: 'inline-block',
	verticalAlign: 'middle',
	paddingLeft: token('space.050', '4px'),
});

export const ExternalLinkIconContainer = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={externalLinkIconContainerStyles}>{children}</div>;
