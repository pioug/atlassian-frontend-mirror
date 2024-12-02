import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { messages } from '../../../../../../messages';
import Text from '../index';

describe('Element: Text', () => {
	const testId = 'smart-element-text';

	it('renders element', async () => {
		const content = 'random text';
		render(<Text content={content} />);

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-text')).toBeTruthy();
		expect(element).toHaveTextContent(content);
	});

	it('renders formatted message', async () => {
		const message = {
			descriptor: messages.cannot_find_link,
		};
		render(
			<IntlProvider locale="en">
				<Text message={message} />
			</IntlProvider>,
		);

		const element = await screen.findByTestId(testId);

		expect(element.textContent).toBe(messages.cannot_find_link.defaultMessage);
	});

	it('renders formatted message as priority', async () => {
		const message = {
			descriptor: messages.cannot_find_link,
		};
		render(
			<IntlProvider locale="en">
				<Text content="random text" message={message} />
			</IntlProvider>,
		);

		const element = await screen.findByTestId(testId);

		expect(element.textContent).toBe(messages.cannot_find_link.defaultMessage);
	});

	it('renders formatted messages with values', async () => {
		const message = {
			descriptor: messages.created_by,
			values: { context: 'someone' },
		};
		render(
			<IntlProvider locale="en">
				<Text content="random text" message={message} />
			</IntlProvider>,
		);

		const element = await screen.findByTestId(testId);

		expect(element).toHaveTextContent('Created by someone');
	});

	it('does not renders without either message or children', async () => {
		const { container } = render(<Text />);

		expect(container.children.length).toBe(0);
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			color: 'black',
		});
		render(<Text content="random text" overrideCss={overrideCss} />);

		const element = await screen.findByTestId(testId);

		expect(element).toHaveStyleDeclaration('color', 'black');
	});
});
