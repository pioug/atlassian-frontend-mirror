import React, { forwardRef } from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { waitFor } from '@atlassian/testing-library/wait-for';
import { within } from '@atlassian/testing-library/within';

import { Popup as ComposablePopup } from '../../compositional/popup';
import { PopupContent } from '../../compositional/popup-content';
import { PopupTrigger } from '../../compositional/popup-trigger';
import { Popup } from '../../popup';
import { type PopupComponentProps, type TriggerProps } from '../../types';

const testId = 'popup';

const CustomContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
	({ children, 'data-testid': testId }, ref) => (
		<section ref={ref} data-testid={testId}>
			{children}
		</section>
	),
);
CustomContainer.displayName = 'CustomContainer';

function trigger({ ref }: TriggerProps) {
	return (
		<button type="button" ref={ref}>
			Trigger
		</button>
	);
}

describe.each([false, true])('Popup test IDs with top layer enabled: %s', (topLayerEnabled) => {
	beforeEach(() => {
		(topLayerEnabled ? passGate : failGate)('platform-dst-top-layer');
		if (!topLayerEnabled) {
			passGate('platform-dst-motion-uplift-popup');
		}
	});

	describe.each([false, true])('composable API: %s', (composable) => {
		function TestPopup({
			isOpen,
			testId,
			popupComponent,
		}: {
			isOpen: boolean;
			testId?: string;
			popupComponent?: typeof CustomContainer;
		}) {
			if (composable) {
				return (
					<ComposablePopup isOpen={isOpen}>
						<PopupTrigger>{trigger}</PopupTrigger>
						<PopupContent testId={testId} popupComponent={popupComponent}>
							{() => <button type="button">Popup action</button>}
						</PopupContent>
					</ComposablePopup>
				);
			}

			return (
				<Popup
					isOpen={isOpen}
					testId={testId}
					popupComponent={popupComponent}
					trigger={trigger}
					content={() => <button type="button">Popup action</button>}
				/>
			);
		}

		it.each([undefined, CustomContainer])(
			'preserves content and host IDs through opening and closing with container %s',
			async (popupComponent) => {
				const { rerender } = render(
					<TestPopup isOpen={false} testId={testId} popupComponent={popupComponent} />,
				);
				expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
				expect(screen.queryByTestId(`${testId}--container`)).not.toBeInTheDocument();

				rerender(<TestPopup isOpen testId={testId} popupComponent={popupComponent} />);

				const content = screen.getByTestId(testId);
				const host = screen.getByTestId(`${testId}--container`);
				expect(content).toBeVisible();
				expect(host).toContainElement(content);
				expect(content).not.toBe(host);
				expect(within(content).getByRole('button', { name: 'Popup action' })).toBeVisible();

				rerender(<TestPopup isOpen={false} testId={testId} popupComponent={popupComponent} />);

				await waitFor(() =>
					expect(screen.queryByTestId(`${testId}--container`)).not.toBeInTheDocument(),
				);
				expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
			},
		);

		it('should capture and report a11y violations', async () => {
			render(<TestPopup isOpen testId={testId} />);
			await expect(document.body).toBeAccessible();
		});
	});
});
