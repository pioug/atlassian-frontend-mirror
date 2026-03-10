/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';
import { IntlProvider, type MessageFormatElement } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getFlexibleCardTestWrapper } from '../../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { IconType, InternalActionName } from '../../../../../../../constants';
import { messages } from '../../../../../../../messages';
import type { FlexibleUiDataContext } from '../../../../../../../state/flexible-ui-context/types';
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

	describe('large icon (platform_sl_3p_auth_rovo_action_kill_switch)', () => {
		const rovoActionAvailableData: FlexibleUiDataContext = {
			actions: { [InternalActionName.RovoChatAction]: true },
		};
		const rovoActionUnavailableData: FlexibleUiDataContext = {
			actions: { [InternalActionName.RovoChatAction]: false },
		};

		ffTest.on('platform_sl_3p_auth_rovo_action_kill_switch', 'when FF is ON', () => {
			it('uses large container gap when rovo action is available', async () => {
				render(<Badge icon={IconType.Comment} label="99" iconSize="large" />, {
					wrapper: getFlexibleCardTestWrapper(rovoActionAvailableData),
				});

				const badge = await screen.findByTestId('smart-element-badge');
				expect(badge).toHaveCompiledCss('gap', 'var(--ds-space-100,8px)');
			});

			it('uses large icon sizing when rovo action is available', async () => {
				render(<Badge icon={IconType.Comment} label="99" iconSize="large" />, {
					wrapper: getFlexibleCardTestWrapper(rovoActionAvailableData),
				});

				const icon = await screen.findByTestId('smart-element-badge-icon');
				const iconWrapper = icon.parentElement;
				expect(iconWrapper).toHaveCompiledCss('height', '24px');
				expect(iconWrapper).toHaveCompiledCss('width', '24px');
			});

			it('respects hideIcon when rovo action is available', async () => {
				render(<Badge icon={IconType.Comment} label="99" hideIcon iconSize="large" />, {
					wrapper: getFlexibleCardTestWrapper(rovoActionAvailableData),
				});

				expect(screen.queryByTestId('smart-element-badge-icon')).toBeNull();
				const label = await screen.findByTestId('smart-element-badge-label');
				expect(label).toBeInTheDocument();
			});

			it('uses standard gap when rovo action is unavailable', async () => {
				render(<Badge icon={IconType.Comment} label="99" iconSize="large" />, {
					wrapper: getFlexibleCardTestWrapper(rovoActionUnavailableData),
				});

				const badge = await screen.findByTestId('smart-element-badge');
				expect(badge).toHaveCompiledCss('gap', 'var(--ds-space-050,4px)');
			});

			it('uses standard icon sizing when rovo action is unavailable', async () => {
				render(<Badge icon={IconType.Comment} label="99" iconSize="large" />, {
					wrapper: getFlexibleCardTestWrapper(rovoActionUnavailableData),
				});

				const icon = await screen.findByTestId('smart-element-badge-icon');
				const iconWrapper = icon.parentElement;
				expect(iconWrapper).toHaveCompiledCss('height', '1pc');
				expect(iconWrapper).toHaveCompiledCss('width', '1pc');
			});

			it('uses standard gap when iconSize is default even if rovo action is available', async () => {
				render(<Badge icon={IconType.Comment} label="99" />, {
					wrapper: getFlexibleCardTestWrapper(rovoActionAvailableData),
				});

				const badge = await screen.findByTestId('smart-element-badge');
				expect(badge).toHaveCompiledCss('gap', 'var(--ds-space-050,4px)');
			});

			it('uses standard icon sizing when iconSize is default even if rovo action is available', async () => {
				render(<Badge icon={IconType.Comment} label="99" />, {
					wrapper: getFlexibleCardTestWrapper(rovoActionAvailableData),
				});

				const icon = await screen.findByTestId('smart-element-badge-icon');
				const iconWrapper = icon.parentElement;
				expect(iconWrapper).toHaveCompiledCss('height', '1pc');
				expect(iconWrapper).toHaveCompiledCss('width', '1pc');
			});
		});

		ffTest.off('platform_sl_3p_auth_rovo_action_kill_switch', 'when FF is OFF', () => {
			it('uses standard gap even when rovo action is available', async () => {
				render(<Badge icon={IconType.Comment} label="99" iconSize="large" />, {
					wrapper: getFlexibleCardTestWrapper(rovoActionAvailableData),
				});

				const badge = await screen.findByTestId('smart-element-badge');
				expect(badge).toHaveCompiledCss('gap', 'var(--ds-space-050,4px)');
			});

			it('uses standard icon sizing even when rovo action is available', async () => {
				render(<Badge icon={IconType.Comment} label="99" iconSize="large" />, {
					wrapper: getFlexibleCardTestWrapper(rovoActionAvailableData),
				});

				const icon = await screen.findByTestId('smart-element-badge-icon');
				const iconWrapper = icon.parentElement;
				expect(iconWrapper).toHaveCompiledCss('height', '1pc');
				expect(iconWrapper).toHaveCompiledCss('width', '1pc');
			});
		});
	});
});
