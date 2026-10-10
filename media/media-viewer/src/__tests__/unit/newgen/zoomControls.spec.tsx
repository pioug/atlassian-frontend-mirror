import React from 'react';

import { createIntl } from 'react-intl';

import { fakeIntl } from '@atlaskit/media-test-helpers/fakeI18n';
import { render, screen, userEvent } from '@atlassian/testing-library';

import { ZoomLevel } from '../../../domain/zoomLevel';
import { ZoomControlsBase, type ZoomControlsProps } from '../../../zoomControls';

describe('Zooming', () => {
	describe('<ZoomControls />', () => {
		const setupBase = (props?: Partial<ZoomControlsProps>) => {
			const onChange = jest.fn();
			const createAnalyticsEventSpy = jest.fn();
			createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });

			render(
				<ZoomControlsBase
					createAnalyticsEvent={createAnalyticsEventSpy}
					zoomLevel={new ZoomLevel(1)}
					onChange={onChange}
					intl={fakeIntl}
					{...props}
				/>,
			);

			const buttons = screen.getAllByRole('button');
			return {
				onChange,
				createAnalyticsEventSpy,
				zoomOutButton: buttons[0],
				zoomInButton: buttons[buttons.length - 1],
			};
		};

		it('should increase and decrease zoom', async () => {
			const { onChange, zoomOutButton, zoomInButton } = setupBase();
			const zoomLevel = new ZoomLevel(1);

			await userEvent.click(zoomOutButton);
			expect(onChange).toHaveBeenLastCalledWith(zoomLevel.zoomOut());
			await userEvent.click(zoomInButton);
			expect(onChange).toHaveBeenLastCalledWith(zoomLevel.zoomIn());
		});

		it('should not allow zooming above upper limit', async () => {
			const { onChange, zoomInButton } = setupBase({
				zoomLevel: new ZoomLevel(1).fullyZoomIn(),
			});
			await userEvent.click(zoomInButton);
			expect(onChange).not.toHaveBeenCalled();
		});

		it('should not allow zooming below lower limit', async () => {
			const { onChange, zoomOutButton } = setupBase({
				zoomLevel: new ZoomLevel(1).fullyZoomOut(),
			});
			await userEvent.click(zoomOutButton);
			expect(onChange).not.toHaveBeenCalled();
		});

		describe('zoom level indicator', () => {
			it('shows 100% zoom level', async () => {
				setupBase();
				expect(screen.getByTestId('zoom-level-indicator')).toHaveTextContent('100 %');
				await expect(document.body).toBeAccessible();
			});
		});

		describe('analytics', () => {
			it('triggers analytics events on zoom Out', async () => {
				const { createAnalyticsEventSpy, zoomOutButton } = setupBase();
				await userEvent.click(zoomOutButton);

				expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
					eventType: 'ui',
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'zoomOut',
					attributes: {
						zoomScale: 0.48,
					},
				});
			});

			it('triggers analytics events on zoom in', async () => {
				const { createAnalyticsEventSpy, zoomInButton } = setupBase();
				await userEvent.click(zoomInButton);

				expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
					eventType: 'ui',
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'zoomIn',
					attributes: {
						zoomScale: 1.5,
					},
				});
			});
		});

		describe('in inset mode', () => {
			let footer: HTMLDivElement;

			afterEach(() => {
				footer?.remove();
			});

			const setupInset = (props?: Partial<ZoomControlsProps>) => {
				footer = document.createElement('div');
				document.body.appendChild(footer);
				const onChange = jest.fn();

				render(
					<ZoomControlsBase
						createAnalyticsEvent={jest.fn().mockReturnValue({ fire: jest.fn() })}
						zoomLevel={new ZoomLevel(1)}
						onChange={onChange}
						intl={fakeIntl}
						isInsetViewer
						mediaFooterControls={footer}
						{...props}
					/>,
				);

				return { footer, onChange };
			};

			it('should render nothing until the media footer is available', () => {
				render(
					<ZoomControlsBase
						zoomLevel={new ZoomLevel(1)}
						onChange={jest.fn()}
						intl={fakeIntl}
						isInsetViewer
						mediaFooterControls={null}
					/>,
				);

				expect(screen.queryByRole('button')).not.toBeInTheDocument();
			});

			it('should render the controls and their children into the media footer', async () => {
				const { footer } = setupInset({ children: <span>HD</span> });

				expect(footer).toContainElement(screen.getByTestId('zoom-level-indicator'));
				expect(footer).toContainElement(screen.getByText('HD'));
				expect(screen.getByTestId('zoom-level-indicator')).toHaveTextContent('100%');

				await expect(document.body).toBeAccessible();
			});

			it('should name the zoom level button with the current zoom', () => {
				render(
					<ZoomControlsBase
						createAnalyticsEvent={jest.fn().mockReturnValue({ fire: jest.fn() })}
						zoomLevel={new ZoomLevel(1)}
						onChange={jest.fn()}
						intl={createIntl({ locale: 'en' })}
						isInsetViewer
						mediaFooterControls={document.body}
					/>,
				);

				expect(
					screen.getByRole('button', { name: '100% zoom, fit to screen' }),
				).toBeInTheDocument();
			});

			it('should zoom in and out from the footer controls', async () => {
				const { onChange } = setupInset();
				const zoomLevel = new ZoomLevel(1);

				await userEvent.click(screen.getByRole('button', { name: 'fakeIntl["zoom out"]' }));
				expect(onChange).toHaveBeenLastCalledWith(zoomLevel.zoomOut());
				await userEvent.click(screen.getByRole('button', { name: 'fakeIntl["zoom in"]' }));
				expect(onChange).toHaveBeenLastCalledWith(zoomLevel.zoomIn());
			});

			it('should disable zoom in at the upper limit', () => {
				setupInset({ zoomLevel: new ZoomLevel(1).fullyZoomIn() });

				expect(screen.getByRole('button', { name: 'fakeIntl["zoom in"]' })).toBeDisabled();
			});

			it('should fit the media to the screen from the zoom percentage', async () => {
				const { onChange } = setupInset({ zoomLevel: new ZoomLevel(0.5).zoomIn() });

				await userEvent.click(screen.getByTestId('zoom-level-indicator'));

				expect(onChange).toHaveBeenCalledWith(new ZoomLevel(0.5));
			});

			it('should call onResetZoom instead of onChange when it is provided', async () => {
				const onResetZoom = jest.fn();
				const { onChange } = setupInset({ onResetZoom });

				await userEvent.click(screen.getByTestId('zoom-level-indicator'));

				expect(onResetZoom).toHaveBeenCalledTimes(1);
				expect(onChange).not.toHaveBeenCalled();
			});
		});
	});
});
