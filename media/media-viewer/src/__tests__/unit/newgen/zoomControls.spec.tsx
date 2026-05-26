import React from 'react';
import { render, screen, userEvent } from '@atlassian/testing-library';
import { ZoomControlsBase, type ZoomControlsProps } from '../../../zoomControls';
import { ZoomLevel } from '../../../domain/zoomLevel';
import { fakeIntl } from '@atlaskit/media-test-helpers';

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
	});
});
