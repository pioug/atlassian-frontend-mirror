import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import keycode from 'keycode';

import { AnalyticsListener } from '@atlaskit/analytics';

import {
	QS_ANALYTICS_EV_CLOSE,
	QS_ANALYTICS_EV_KB_CTRLS_USED,
	QS_ANALYTICS_EV_OPEN,
	QS_ANALYTICS_EV_SUBMIT,
} from '../../components/constants';
import QuickSearch from '../../components/QuickSearch';
import ResultItemGroup from '../../components/ResultItem/ResultItemGroup';
import PersonResult from '../../components/Results/PersonResult';

const results = (onClick: jest.Mock) => (
	<ResultItemGroup title="People">
		<PersonResult resultId="one" name="One" onClick={onClick} />
		<PersonResult resultId="two" name="Two" onClick={onClick} />
	</ResultItemGroup>
);

const renderQuickSearch = (
	onAnalyticsEvent: jest.Mock,
	children: React.ReactNode,
	props: Partial<React.ComponentProps<typeof QuickSearch>> = {},
) =>
	render(
		<AnalyticsListener matchPrivate onEvent={onAnalyticsEvent}>
			<QuickSearch {...props}>{children}</QuickSearch>
		</AnalyticsListener>,
	);

describe('<QuickSearch />', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = renderQuickSearch(jest.fn(), results(jest.fn()));
		await expect(container).toBeAccessible();
	});

	it('renders its children and emits open/close analytics events', () => {
		const analytics = jest.fn();
		const { getByText, unmount } = renderQuickSearch(analytics, results(jest.fn()));

		expect(getByText('One')).toBeInTheDocument();
		expect(analytics).toHaveBeenCalledWith(QS_ANALYTICS_EV_OPEN, {});
		unmount();
		expect(analytics).toHaveBeenCalledWith(QS_ANALYTICS_EV_CLOSE, {});
	});

	it('submits a result when it is clicked', () => {
		const onClick = jest.fn();
		const analytics = jest.fn();
		const { getByText } = renderQuickSearch(analytics, results(onClick));

		fireEvent.click(getByText('One'));

		expect(onClick).toHaveBeenCalledWith(
			expect.objectContaining({ resultId: 'one', type: 'person' }),
		);
		expect(analytics).toHaveBeenCalledWith(
			QS_ANALYTICS_EV_SUBMIT,
			expect.objectContaining({ resultCount: 2, queryLength: 0, method: 'click' }),
		);
	});

	it('moves selection with arrow keys and reports keyboard analytics', () => {
		const analytics = jest.fn();
		const onSelectedResultIdChanged = jest.fn();
		const { getByRole } = renderQuickSearch(analytics, results(jest.fn()), {
			onSelectedResultIdChanged,
		});

		fireEvent.keyDown(getByRole('textbox'), {
			key: 'ArrowDown',
			keyCode: keycode('down'),
		});

		expect(onSelectedResultIdChanged).toHaveBeenCalledWith('one');
		expect(analytics).toHaveBeenCalledWith(QS_ANALYTICS_EV_KB_CTRLS_USED, expect.any(Object));
	});

	it('submits the search when Enter is pressed without a selected result', () => {
		const analytics = jest.fn();
		const onSearchSubmit = jest.fn();
		const { getByRole } = renderQuickSearch(analytics, results(jest.fn()), { onSearchSubmit });

		fireEvent.keyDown(getByRole('textbox'), { key: 'Enter', keyCode: keycode('enter') });

		expect(onSearchSubmit).toHaveBeenCalledTimes(1);
		expect(analytics).toHaveBeenCalledWith(
			QS_ANALYTICS_EV_SUBMIT,
			expect.objectContaining({ resultCount: 2, queryLength: 0, method: 'shortcut' }),
		);
	});
});
