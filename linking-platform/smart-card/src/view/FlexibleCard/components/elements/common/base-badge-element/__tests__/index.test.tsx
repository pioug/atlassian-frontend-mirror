/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';
import { IntlProvider, type MessageFormatElement } from 'react-intl-next';

import { IconType } from '../../../../../../../constants';
import { messages } from '../../../../../../../messages';
import Badge from '../index';

jest.mock('react-render-image', () => ({ src, loading, loaded, errored }: any) => {
	switch (src) {
		case 'src-loading':
			return loading;
		case 'src-loaded':
			return loaded;
		case 'src-error':
			return errored;
		default:
			return <span>{src}</span>;
	}
});

describe('Element: Badge', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<Badge icon={IconType.Comment} label="99" />);

		await expect(container).toBeAccessible();
	});

	it('renders element', async () => {
		render(<Badge icon={IconType.Comment} label="99" />);

		const element = await screen.findByTestId('smart-element-badge');

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-badge')).toBeTruthy();
		expect(element).toHaveTextContent('99');
	});

	it('renders image as badge icon', async () => {
		render(
			<IntlProvider locale="en">
				<Badge label="desc" url="src-loaded" />
			</IntlProvider>,
		);

		const element = await screen.findByTestId('smart-element-badge-image');

		expect(element).toBeTruthy();
	});

	it('does not render image as badge icon if hideBadgeIcon is true', async () => {
		render(<Badge label="desc" url="src-loaded" hideIcon={true} />);

		const element = screen.queryByTestId('smart-element-badge-image');

		expect(element).toBeNull();
	});

	describe('size', () => {
		it('renders text at .75rem', async () => {
			render(<Badge icon={IconType.Comment} label="99" />);

			const text = await screen.findByTestId('smart-element-badge-label');

			expect(text).toHaveCompiledCss(
				'font',
				'var(--ds-font-body-small,normal 400 9pt/1pc "Atlassian Sans",ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Ubuntu,"Helvetica Neue",sans-serif)',
			);
		});
	});

	describe('priority', () => {
		it.each([
			[IconType.PriorityBlocker, messages.priority_blocker.defaultMessage],
			[IconType.PriorityCritical, messages.priority_critical.defaultMessage],
			[IconType.PriorityHigh, messages.priority_high.defaultMessage],
			[IconType.PriorityHighest, messages.priority_highest.defaultMessage],
			[IconType.PriorityLow, messages.priority_low.defaultMessage],
			[IconType.PriorityLowest, messages.priority_lowest.defaultMessage],
			[IconType.PriorityMajor, messages.priority_major.defaultMessage],
			[IconType.PriorityMedium, messages.priority_medium.defaultMessage],
			[IconType.PriorityMinor, messages.priority_minor.defaultMessage],
			[IconType.PriorityTrivial, messages.priority_trivial.defaultMessage],
			[IconType.PriorityUndefined, messages.priority_undefined.defaultMessage],
		])(
			'renders formatted message for priority badge',
			async (icon: IconType, content: string | MessageFormatElement[] | undefined) => {
				render(
					<IntlProvider locale="en">
						<Badge icon={icon} />
					</IntlProvider>,
				);

				const element = await screen.findByTestId('smart-element-badge');

				expect(element.textContent).toBe(content);
			},
		);
	});

	it('does not render if there is no icon nor content', async () => {
		const { container } = render(<Badge />);

		expect(container.children.length).toEqual(0);
	});

	it('does not render if content is not provided and no formatted message available', async () => {
		const { container } = render(<Badge icon={IconType.Comment} />);

		expect(container.children.length).toEqual(0);
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		render(<Badge icon={IconType.Comment} label="99" css={overrideCss} />);

		const element = await screen.findByTestId('smart-element-badge');

		expect(element).toHaveCompiledCss('background-color', 'blue');
	});
});
