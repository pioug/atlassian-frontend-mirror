import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import exampleImage from '../../../examples/img/example-image.png';
import EmptyState from '../../empty-state';
import HeaderImage from '../../styled/image';
import SpinnerContainer from '../../styled/spinner-container';

const props = {
	maxWidth: 500,
	maxHeight: 500,
	header: 'I am the header',
	description: `Lorem ipsum is a pseudo-Latin text used in web design,
        typography, layout, and printing in place of English to emphasise
        design elements over content. It's also called placeholder (or filler)
        text. It's a convenient tool for mock-ups.`,
	imageUrl: exampleImage,
};

it('All EmptyState components should not fail aXe audit', async () => {
	// Test basic EmptyState
	const { container: emptyStateContainer, unmount: unmountEmptyState } = render(
		<EmptyState {...props} />,
	);
	await axe(emptyStateContainer);
	unmountEmptyState();

	// Test HeaderImage
	const { container: imageContainer, unmount: unmountImage } = render(
		<HeaderImage maxHeight={props.maxHeight} maxWidth={props.maxWidth} src={props.imageUrl} />,
	);
	await axe(imageContainer);
	unmountImage();

	// Test SpinnerContainer
	const { container: spinnerContainer } = render(<SpinnerContainer />);
	await axe(spinnerContainer);
});
