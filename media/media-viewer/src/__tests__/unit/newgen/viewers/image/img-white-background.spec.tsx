import React from 'react';

import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { Img } from '../../../../../styleWrappers';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';
const WHITE = 'rgb(255, 255, 255)';

const renderImgBackground = () => {
	render(
		<Img
			data-testid="media-viewer-image"
			canDrag={false}
			isDragging={false}
			shouldPixelate={false}
			src="some-src"
			alt="some-alt"
			style={{}}
			onLoad={jest.fn()}
			onMouseDown={jest.fn()}
			onError={jest.fn()}
		/>,
	);
	return window.getComputedStyle(screen.getByRole('img')).backgroundColor;
};

describe('Img white background for transparent images', () => {
	it('should paint a white background behind the image when the gate is on', () => {
		passGate('platform_media_white_bg_transparent_images');

		expect(renderImgBackground()).toBe(WHITE);
	});

	it('should leave the image transparent when the gate is off', () => {
		failGate('platform_media_white_bg_transparent_images');

		expect(renderImgBackground()).toBe(TRANSPARENT);
	});
});
