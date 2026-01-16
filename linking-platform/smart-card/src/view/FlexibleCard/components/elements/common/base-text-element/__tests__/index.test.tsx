/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { messages } from '../../../../../../../messages';
import Text from '../index';

describe('Element: Text', () => {
	const testId = 'smart-element-text';

	it('should capture and report a11y violations', async () => {
		const content = 'random text';
		const { container } = render(<Text content={content} />);

		await expect(container).toBeAccessible();
	});

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

	it('renders formatted message as priority when hideFormat is false', async () => {
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

	it('renders content as priority when hideFormat is true', async () => {
		const message = {
			descriptor: messages.created_by,
			values: { context: 'someone' },
		};

		const content = 'random text';
		render(<Text content={content} message={message} hideFormat />);

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-text')).toBeTruthy();
		expect(element).toHaveTextContent(content);
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
		render(<Text content="random text" css={overrideCss} />);

		const element = await screen.findByTestId(testId);

		expect(element).toHaveCompiledCss('color', '#000');
	});

	it('renders with font size override', async () => {
		const content = 'random text';
		render(<Text content={content} fontSize="font.body.large" />);
		const element = await screen.findByTestId(testId);
		expect(element).toBeVisible();
		expect(element).toHaveCompiledCss(
			'font',
			'var(--ds-font-body-large,normal 400 1pc/24px "Atlassian Sans",ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Ubuntu,"Helvetica Neue",sans-serif)',
		);
	});
});
