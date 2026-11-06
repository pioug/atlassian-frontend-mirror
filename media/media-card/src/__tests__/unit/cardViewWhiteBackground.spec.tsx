jest.mock('../../utils/getElementDimension');
jest.mock('../../card/ui/imageRenderer', () => ({
	ImageRenderer: jest.fn(() => null),
}));

import React from 'react';

import { IntlProvider } from 'react-intl';

import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/testing-library/react';

import { CardViewBase, type CardViewProps } from '../../card/cardView';
import { ImageRenderer } from '../../card/ui/imageRenderer';
import { getElementDimension } from '../../utils/getElementDimension';

(getElementDimension as jest.Mock).mockReturnValue(150);

const identifier = {
	id: 'some-id',
	mediaItemType: 'file',
	collectionName: 'some-collection',
} as const;

const cardPreview = {
	dataURI: 'some-data',
	source: 'remote',
} as const;

// `ImageRendererV2` turns `useWhiteBackground` into the white background class, which is already
// covered by its own spec. What matters here is that cardView wires the gate into that prop for
// raster media, which it previously only did for SVGs.
const renderedWithWhiteBackground = (props: Partial<CardViewProps> = {}) => {
	render(
		<IntlProvider locale="en">
			<CardViewBase
				status="complete"
				mediaItemType="file"
				dimensions={{ width: 100, height: 100 }}
				identifier={identifier}
				cardPreview={cardPreview}
				metadata={{ id: 'some-id', mediaType: 'image', mimeType: 'image/png', name: 'my-file' }}
				{...props}
			/>
		</IntlProvider>,
	);
	return jest.mocked(ImageRenderer).mock.calls[0][0].useWhiteBackground;
};

describe('CardView white background for transparent raster images', () => {
	beforeEach(() => {
		jest.mocked(ImageRenderer).mockClear();
	});

	it('should apply a white background to raster media when the gate is on', () => {
		passGate('platform_media_white_bg_transparent_images');

		expect(renderedWithWhiteBackground()).toBe(true);
	});

	it('should leave raster media transparent when the gate is off', () => {
		failGate('platform_media_white_bg_transparent_images');

		expect(renderedWithWhiteBackground()).toBe(false);
	});

	it('should suppress the white background when an explicit backgroundColor is provided', () => {
		passGate('platform_media_white_bg_transparent_images');

		expect(renderedWithWhiteBackground({ backgroundColor: 'red' })).toBe(false);
	});
});
