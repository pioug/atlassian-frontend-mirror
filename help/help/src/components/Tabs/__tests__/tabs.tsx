import React from 'react';
import { Tabs } from '../index';
import { render } from '@testing-library/react';

describe('Tabs', () => {
	it('should render tabs', async () => {
		const tabs = [
			{ label: 'Tab 1', icon: <div>Icon 1</div> },
			{ label: 'Tab 2', icon: <div>Icon 2</div> },
		];
		const { getByText } = render(<Tabs activeTab={0} onTabClick={() => {}} tabs={tabs} />);
		expect(getByText('Tab 1')).toBeInTheDocument();
		expect(getByText('Tab 2')).toBeInTheDocument();
		expect(getByText('Icon 1')).toBeInTheDocument();
		expect(getByText('Icon 2')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should call onTabClick when a tab is clicked', async () => {
		const tabs = [
			{ label: 'Tab 1', icon: <div>Icon 1</div> },
			{ label: 'Tab 2', icon: <div>Icon 2</div> },
		];
		const onTabClick = jest.fn();
		const { getByText } = render(<Tabs activeTab={0} onTabClick={onTabClick} tabs={tabs} />);
		getByText('Tab 2').click();
		expect(onTabClick).toHaveBeenCalledWith(1);

		await expect(document.body).toBeAccessible();
	});
});
