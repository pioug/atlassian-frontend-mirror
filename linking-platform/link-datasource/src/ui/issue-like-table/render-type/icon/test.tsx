import React from 'react';

import { render } from '@testing-library/react';

import * as Image from '../../../../../examples-helpers/images.json';

import Icon, { ICON_TYPE_TEST_ID, ICON_TYPE_TEXT_TEST_ID } from './index';

describe('Icon Type', () => {
	const setup = ({ source = Image.trello, ...props }) => {
		return render(<Icon source={source} {...props} />);
	};

	it('renders when the source attr is passed', async () => {
		const { queryByTestId, queryByRole } = setup({});

		const imgContainer = queryByTestId(ICON_TYPE_TEST_ID);
		/**
		 * If the element has a blank alt attribute i.e. alt='' it will have the role presentation.
		 * See https://www.w3.org/TR/html-aria/#docconformance for more info
		 */
		const img = queryByRole('presentation');

		expect(imgContainer).toBeInTheDocument();
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', Image.trello);
	});

	it('renders with the alt text when label is passed', async () => {
		const { queryByTestId, queryByRole } = setup({
			label: 'my_image',
		});

		const imgContainer = queryByTestId(ICON_TYPE_TEST_ID);
		const img = queryByRole('img');

		expect(imgContainer).toBeInTheDocument();
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('alt', 'my_image');
	});

	it('renders with the text when "text" prop is passed', async () => {
		const { queryByTestId, queryByRole } = setup({
			label: 'my_image',
			text: 'my_text',
		});

		const imgContainer = queryByTestId(ICON_TYPE_TEST_ID);
		const textContainer = queryByTestId(ICON_TYPE_TEXT_TEST_ID);
		const img = queryByRole('img');

		expect(imgContainer).toBeInTheDocument();
		expect(img).toHaveAttribute('alt', 'my_image');
		expect(textContainer).toHaveTextContent('my_text');
	});

	it('should not render the text when "text" prop is not passed', async () => {
		const { queryByTestId } = setup({
			label: 'my_image',
		});

		const textContainer = queryByTestId(ICON_TYPE_TEXT_TEST_ID);
		expect(textContainer).not.toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<Icon source={''} />);
		await expect(container).toBeAccessible();
	});
});
