/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button, { LinkButton } from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import EmptyState from '../src';

import exampleImage from './img/example-image.png';

const containerStyles = css({
	width: '300px',
	backgroundColor: token('color.background.neutral'),
});

const Container: FC<{ children: ReactNode }> = ({ children }) => (
	<div css={containerStyles}>{children}</div>
);

const primaryAction = (
	<Button appearance="primary" onClick={() => console.log('primary action clicked')}>
		Primary action
	</Button>
);

const secondaryAction = (
	<Button onClick={() => console.log('secondary action clicked')}>Secondary action</Button>
);

const tertiaryAction = (
	<LinkButton appearance="subtle" href="#" target="_blank">
		Tertiary action
	</LinkButton>
);

const props = {
	header: 'I am the header',
	imageUrl: exampleImage,
	imageHeight: 200,
	description: `Lorem ipsum is a pseudo-Latin text used in web design,
        typography, layout, and printing in place of English to emphasise
        design elements over content. It's also called placeholder (or filler)
        text. It's a convenient tool for mock-ups.`,
	primaryAction,
	secondaryAction,
	tertiaryAction,
};

export default () => (
	<Container>
		<EmptyState {...props} />
	</Container>
);
