// platform/packages/people-and-teams/profilecard/src/__tests__/unit/PopupTrigger.test.tsx

import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { Text } from '@atlaskit/primitives';

import { PopupTrigger } from '../../../components/common/PopupTrigger';

describe('PopupTrigger', () => {
	const showProfilecard = jest.fn();
	const hideProfilecard = jest.fn();
	const forwardRef = React.createRef<HTMLSpanElement>();

	const renderWithIntl = ({ trigger }: { trigger: 'hover' | 'click' }) => {
		return render(
			<IntlProvider locale="en" defaultLocale="en-US">
				<PopupTrigger
					trigger={trigger}
					showProfilecard={showProfilecard}
					hideProfilecard={hideProfilecard}
					forwardRef={forwardRef}
				>
					<Text>popup trigger</Text>
				</PopupTrigger>
			</IntlProvider>,
		);
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should call showProfilecard on mouse enter when trigger is hover', () => {
		const { getByText } = renderWithIntl({ trigger: 'hover' });

		fireEvent.mouseEnter(getByText('popup trigger'));
		expect(showProfilecard).toHaveBeenCalled();
	});

	it('should call hideProfilecard on mouse leave when trigger is hover', () => {
		const { getByText } = renderWithIntl({ trigger: 'hover' });

		fireEvent.mouseLeave(getByText('popup trigger'));
		expect(hideProfilecard).toHaveBeenCalled();
	});

	it('should call showProfilecard on click when trigger is click', () => {
		const { getByText } = renderWithIntl({ trigger: 'click' });

		fireEvent.click(getByText('popup trigger'));
		expect(showProfilecard).toHaveBeenCalled();
	});

	it('should call showProfilecard on key press Enter or Space', () => {
		const { getByText } = renderWithIntl({ trigger: 'click' });
		fireEvent.keyPress(getByText('popup trigger'), {
			key: 'Enter',
			code: 'Enter',
			charCode: 13,
		});
		expect(showProfilecard).toHaveBeenCalled();

		fireEvent.keyPress(getByText('popup trigger'), {
			key: ' ',
			code: 'Space',
			charCode: 32,
		});
		expect(showProfilecard).toHaveBeenCalled();
	});

	it('should stop propagation on click', () => {
		const { getByText } = renderWithIntl({ trigger: 'click' });

		const event = new MouseEvent('click', { bubbles: true });
		const stopPropagation = jest.spyOn(event, 'stopPropagation');

		fireEvent(getByText('popup trigger'), event);
		expect(stopPropagation).toHaveBeenCalled();
	});
});
