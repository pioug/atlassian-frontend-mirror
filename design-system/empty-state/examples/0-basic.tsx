import React from 'react';

import Button, { LinkButton } from '@atlaskit/button/new';
import EmptyState from '@atlaskit/empty-state';

import exampleImage from './img/example-image.png';

const primaryAction = (
	<Button appearance="primary" onClick={() => console.log('primary action clicked')}>
		Primary action
	</Button>
);

const secondaryAction = (
	<Button onClick={() => console.log('secondary action clicked')}>Secondary action</Button>
);

const tertiaryAction = (
	<LinkButton appearance="subtle" href="http://www.example.com" target="_blank">
		Tertiary action
	</LinkButton>
);

const props = {
	header: 'I am the header',
	description: `Lorem ipsum is a pseudo-Latin text used in web design,
        typography, layout, and printing in place of English to emphasise
        design elements over content. It's also called placeholder (or filler)
        text. It's a convenient tool for mock-ups.`,
	imageUrl: exampleImage,
	primaryAction,
	secondaryAction,
	tertiaryAction,
	testId: 'empty-state--basic',
};

export default (): React.JSX.Element => <EmptyState {...props} />;
