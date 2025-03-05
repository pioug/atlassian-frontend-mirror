import React, { type ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import SettingsIcon from '@atlaskit/icon/core/migration/settings';

import ButtonGroup from '../../../containers/button-group';
import { SplitButton } from '../../../new-button/containers/split-button';
import Button from '../../../new-button/variants/default/button';
import LinkButton from '../../../new-button/variants/default/link';
import IconButton from '../../../new-button/variants/icon/button';
import LinkIconButton from '../../../new-button/variants/icon/link';
import variants, { iconButtonVariants } from '../../../utils/variants';

variants.forEach(({ name, Component, appearances }) =>
	appearances.map((appearance) => {
		describe(`${name}: '${appearance}' appearance accessibility`, () => {
			it('should not fail an aXe audit', async () => {
				const { container } = render(
					<Component
						// @ts-ignore
						appearance={appearance}
					>
						Save
					</Component>,
				);
				await axe(container);
			});

			it('should not fail an aXe audit when disabled', async () => {
				const { container } = render(
					<Component
						isDisabled
						// @ts-ignore
						appearance={appearance}
					>
						Save
					</Component>,
				);
				await axe(container);
			});

			it('should not fail an aXe audit when selected', async () => {
				const { container } = render(
					<Component
						isSelected
						// @ts-ignore
						appearance={appearance}
					>
						Save
					</Component>,
				);
				await axe(container);
			});

			it('should not fail an aXe audit when loading', async () => {
				const { container } = render(
					<Component
						isLoading
						// @ts-ignore
						appearance={appearance}
					>
						Save
					</Component>,
				);
				await axe(container);
			});
		});
	}),
);

describe('ButtonGroup: Accessibility', () => {
	it('should not fail an aXe audit', async () => {
		const view = render(
			<ButtonGroup>
				<Button>Test button one</Button>
				<Button>Test button two</Button>
				<Button>Test button three</Button>
			</ButtonGroup>,
		);

		await axe(view.container);
	});
});

describe('SplitButton: Accessibility', () => {
	const appearances: ComponentProps<typeof SplitButton>['appearance'][] = ['default', 'primary'];

	appearances.forEach((appearance) => {
		it(`should not fail an aXe audit with ${appearance} appearance`, async () => {
			const view = render(
				<SplitButton appearance={appearance}>
					<Button>Primary action</Button>
					<IconButton onClick={jest.fn()} icon={SettingsIcon} label="Secondary action" />
				</SplitButton>,
			);

			await axe(view.container);
		});
	});

	it('should not fail an aXe audit when disabled', async () => {
		const view = render(
			<SplitButton isDisabled>
				<Button>Primary action</Button>
				<IconButton onClick={jest.fn()} icon={SettingsIcon} label="Secondary action" />
			</SplitButton>,
		);

		await axe(view.container);
	});
});

describe('Icon button: Accessibility', () => {
	iconButtonVariants.forEach(({ name, Component }) => {
		const appearances: ComponentProps<typeof IconButton>['appearance'][] = [
			'default',
			'primary',
			'subtle',
		];

		appearances.forEach((appearance) => {
			it(`${name}: should not fail an aXe audit with ${appearance} appearance`, async () => {
				const view = render(
					<Component appearance={appearance} icon={SettingsIcon} label="Settings" />,
				);

				await axe(view.container);
			});
		});

		const shapes: ComponentProps<typeof IconButton>['shape'][] = ['default', 'circle'];

		shapes.forEach((shape) => {
			it(`${name}: should not fail an aXe audit with ${shape} shape`, async () => {
				const view = render(<Component icon={SettingsIcon} label="Settings" shape={shape} />);

				await axe(view.container);
			});
		});

		it(`${name}: should not fail an aXe audit when disabled`, async () => {
			const view = render(<Component isDisabled icon={SettingsIcon} label="Settings" />);

			await axe(view.container);
		});

		it(`${name}: should not allow 'aria-label' to be passed in order to prevent duplicate labels`, async () => {
			render(
				// @ts-expect-error
				<Component
					testId="icon-button"
					aria-label="Settings"
					isDisabled
					icon={SettingsIcon}
					label="Settings"
				/>,
			);

			const button = screen.getByTestId('icon-button');
			expect(button).not.toHaveAttribute('aria-label');
		});
	});
});

const OPENS_NEW_WINDOW_LABEL = ', (opens new window)';
describe('Link button" Accessibility', () => {
	describe(`"${OPENS_NEW_WINDOW_LABEL}" announcements`, () => {
		describe(`should be appended when \`target="_blank"\``, () => {
			it('to `children` as visually hidden text', () => {
				render(
					<LinkButton href="https://www.atlassian.com" testId="button" target="_blank">
						Atlassian website
					</LinkButton>,
				);

				const button = screen.getByTestId('button');
				expect(button).toHaveAccessibleName(`Atlassian website ${OPENS_NEW_WINDOW_LABEL}`);

				// Check for visually hidden styles
				const hiddenText = screen.getByText(OPENS_NEW_WINDOW_LABEL);
				expect(hiddenText).toHaveCompiledCss('width', '1px');
				expect(hiddenText).toHaveCompiledCss('height', '1px');
				expect(hiddenText).toHaveCompiledCss('position', 'absolute');
				expect(hiddenText).toHaveCompiledCss('clip', 'rect(1px,1px,1px,1px)');
			});
			it('to `aria-label`', () => {
				render(
					<LinkButton
						href="https://www.atlassian.com"
						testId="button"
						target="_blank"
						aria-label="Trello"
					>
						Atlassian website
					</LinkButton>,
				);

				const button = screen.getByTestId('button');
				expect(button).toHaveAccessibleName(`Trello ${OPENS_NEW_WINDOW_LABEL}`);
			});
			it('to `aria-labelledby`', () => {
				render(
					<>
						<div id="the-label">Confluence</div>
						<LinkButton
							href="https://www.atlassian.com"
							testId="button"
							target="_blank"
							aria-labelledby="the-label"
						>
							Atlassian website
						</LinkButton>
					</>,
				);

				const button = screen.getByTestId('button');
				expect(button).toHaveAccessibleName(`Confluence ${OPENS_NEW_WINDOW_LABEL}`);
			});
		});
		it('should not be added to the accessible name if `target` is not "_blank"', () => {
			render(
				<LinkButton href="https://www.atlassian.com" testId="button" target="_self">
					Atlassian website
				</LinkButton>,
			);

			const button = screen.getByTestId('button');
			expect(button).toHaveAccessibleName('Atlassian website');
		});
	});
});

describe('Link icon button" Accessibility', () => {
	describe(`"${OPENS_NEW_WINDOW_LABEL}" announcements`, () => {
		describe(`should be appended when \`target="_blank"\``, () => {
			it('to `children` as visually hidden text', () => {
				render(
					<LinkIconButton
						href="https://www.atlassian.com"
						testId="button"
						target="_blank"
						icon={SettingsIcon}
						label="Settings"
					/>,
				);

				const button = screen.getByTestId('button');
				expect(button).toHaveAccessibleName(`Settings ${OPENS_NEW_WINDOW_LABEL}`);

				// Check for visually hidden styles
				const hiddenText = screen.getByText(OPENS_NEW_WINDOW_LABEL);
				expect(hiddenText).toHaveCompiledCss('width', '1px');
				expect(hiddenText).toHaveCompiledCss('height', '1px');
				expect(hiddenText).toHaveCompiledCss('position', 'absolute');
				expect(hiddenText).toHaveCompiledCss('clip', 'rect(1px,1px,1px,1px)');
			});
			it('to `aria-labelledby`', () => {
				render(
					<>
						<div id="the-label">Confluence</div>
						<LinkIconButton
							href="https://www.atlassian.com"
							testId="button"
							target="_blank"
							icon={SettingsIcon}
							label="Settings"
							aria-labelledby="the-label"
						/>
					</>,
				);

				const button = screen.getByTestId('button');
				expect(button).toHaveAccessibleName(`Confluence ${OPENS_NEW_WINDOW_LABEL}`);
			});
		});
		it('should not be added to the accessible name if `target` is not "_blank"', () => {
			render(
				<LinkIconButton
					href="https://www.atlassian.com"
					testId="button"
					target="_self"
					icon={SettingsIcon}
					label="Settings"
				/>,
			);

			const button = screen.getByTestId('button');
			expect(button).toHaveAccessibleName('Settings');
		});
	});
});
