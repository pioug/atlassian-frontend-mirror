import React from 'react';
import Emoji from '../../../../components/common/Emoji';
import { imageEmoji } from '../../_test-data';
import '@testing-library/jest-dom';

import browserSupport from '../../../../util/browser-support';
import { renderWithIntl } from '../../_testing-library';

describe('<Emoji />', () => {
	beforeAll(() => {
		(window as any).IntersectionObserver = undefined;
	});

	it('should render image when IntersectionObserver is not supported', async () => {
		const result = await renderWithIntl(<Emoji emoji={imageEmoji} />);
		const image = result.getByAltText(imageEmoji.name);
		expect(browserSupport.supportsIntersectionObserver).toBeFalsy();
		expect(image).toHaveAttribute('src', 'https://path-to-image.png');
	});
});
