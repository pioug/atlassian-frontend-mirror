import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { fireEvent, render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { Popup } from '../../popup';

function Iframe() {
	return <iframe width="100px" height="100px" title="outerIframe" />;
}

function TestPopup({ onClose }: { onClose: () => void }) {
	return (
		<div>
			<Popup
				isOpen
				onClose={onClose}
				content={() => <div>content</div>}
				trigger={() => <button type="button">trigger</button>}
				testId="popup"
			/>
			<Iframe />
		</div>
	);
}

describe('Popup with an outside iframe', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<TestPopup onClose={jest.fn()} />);

		await expect(container).toBeAccessible();
	});

	// The legacy popup closes on a window `blur` when focus moves into an outside iframe.
	describe('on the legacy path', () => {
		beforeEach(() => {
			failGate('platform-dst-top-layer');
		});

		it('should call onClose on iframe click if iframe is outside popup', async () => {
			const onClose = jest.fn();
			render(<TestPopup onClose={onClose} />);

			const popupWrapper = screen.getByTestId('popup');
			expect(popupWrapper).toBeInTheDocument();
			expect(popupWrapper).toHaveAttribute('data-ds--level');

			await userEvent.click(screen.getByTitle('outerIframe'));
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	/**
	 * Focus may leave a top-layer popup while it stays open. The popup closes on the next press in
	 * the page, or on Escape. A press inside an iframe is not a press in the page.
	 */
	describe('on the top layer', () => {
		beforeEach(() => {
			passGate('platform-dst-top-layer');
		});

		it('should not call onClose when focus moves into an outside iframe', () => {
			const onClose = jest.fn();
			render(<TestPopup onClose={onClose} />);
			const iframe = screen.getByTitle('outerIframe');

			iframe.focus();
			fireEvent.blur(window);

			expect(iframe).toHaveFocus();
			expect(onClose).not.toHaveBeenCalled();
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});
	});
});
