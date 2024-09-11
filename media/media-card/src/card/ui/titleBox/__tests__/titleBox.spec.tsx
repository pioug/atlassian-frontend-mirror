import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { TitleBox } from '../titleBox';
import { Breakpoint } from '../../common';

const headerTestId = 'title-box-header';
const footerTestId = 'title-box-footer';
const iconTestId = 'title-box-icon';

describe('TitleBox', () => {
	it('should render TitleBox properly', () => {
		const name = 'roberto.jpg';
		const someTimestamp = Date.now();
		render(
			<IntlProvider locale="en">
				<TitleBox name={name} createdAt={someTimestamp} breakpoint={Breakpoint.SMALL} />,
			</IntlProvider>,
		);
		const header = screen.queryByTestId(headerTestId);
		expect(header).toBeInTheDocument();
		expect(header?.textContent).toContain(name);
	});

	it('should render an icon if valid icon name is provided', () => {
		const name = 'roberto.jpg';
		const someTimestamp = Date.now();

		render(
			<IntlProvider locale="en">
				<TitleBox
					name={name}
					createdAt={someTimestamp}
					breakpoint={Breakpoint.SMALL}
					titleBoxIcon="LockFilledIcon"
				/>
				,
			</IntlProvider>,
		);

		expect(screen.queryByTestId(iconTestId)).toBeInTheDocument();
	});

	it('should render a formatted date using LocalizationProvider', () => {
		const name = 'roberto.jpg';
		const timestamp = 1621568300000;

		render(
			<IntlProvider locale="en">
				<TitleBox name={name} createdAt={timestamp} breakpoint={Breakpoint.SMALL} />,
			</IntlProvider>,
		);

		const formatted = screen.queryByTestId(footerTestId);
		expect(formatted?.textContent).toEqual('21 May 2021, 03:38 AM');
	});
});
