import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import { UnhandledErrorCard } from '..';

jest.mock('@atlaskit/icon/core/status-warning', () => {
	return jest.fn((props) => <div data-testid="warning-icon" {...props} />);
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<UnhandledErrorCard />', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render icon with the right size', () => {
		render(<UnhandledErrorCard dimensions={{ width: '50px', height: '50px' }} />);
		expect(WarningIcon).toHaveBeenCalledWith(
			expect.objectContaining({ LEGACY_size: 'medium' }),
			expect.anything(),
		);
	});

	it('should fire onClick event when clicked', () => {
		const spy = jest.fn();
		render(<UnhandledErrorCard onClick={spy} dimensions={{ width: '50px', height: '50px' }} />);
		fireEvent.click(screen.getByTestId('unhandled-error-card'));
		expect(spy).toBeCalledTimes(1);
	});

	it('should render correct dimension when dimension is in string', () => {
		render(<UnhandledErrorCard dimensions={{ width: '50px', height: '50px' }} />);
		const styles = getComputedStyle(screen.getByTestId('unhandled-error-card'));
		expect(styles.width).toBe('50px');
		expect(styles.height).toBe('50px');
	});

	it('should render correct dimension when dimension is in string without px', () => {
		render(<UnhandledErrorCard dimensions={{ width: '50', height: '50' }} />);
		const styles = getComputedStyle(screen.getByTestId('unhandled-error-card'));
		expect(styles.width).toBe('50px');
		expect(styles.height).toBe('50px');
	});

	it('should render correct dimension when dimension is in number', () => {
		render(<UnhandledErrorCard dimensions={{ width: 100, height: 100 }} />);
		const styles = getComputedStyle(screen.getByTestId('unhandled-error-card'));
		expect(styles.width).toBe('100px');
		expect(styles.height).toBe('100px');
	});

	it('should render default dimension when dimension does not contain a valid number', () => {
		render(<UnhandledErrorCard dimensions={{ width: 'abcd', height: 'efg' }} />);
		const styles = getComputedStyle(screen.getByTestId('unhandled-error-card'));
		expect(styles.width).toBe('156px');
		expect(styles.height).toBe('125px');
	});

	it('should show text when width is larger than 240px', () => {
		render(<UnhandledErrorCard dimensions={{ width: 500, height: 300 }} />);
		const text = screen.getByText("We couldn't load this content");
		const styles = getComputedStyle(text);

		expect(styles.getPropertyValue('display')).toBe('block');
	});

	it('should hide text when width is smaller than 240px', () => {
		render(<UnhandledErrorCard dimensions={{ width: 200, height: 300 }} />);
		const text = screen.getByText("We couldn't load this content");
		const styles = getComputedStyle(text);

		expect(styles.getPropertyValue('display')).toBe('none');
	});

	it('should hide text when height is smaller than 90px', () => {
		render(<UnhandledErrorCard dimensions={{ width: 400, height: 80 }} />);
		const text = screen.getByText("We couldn't load this content");
		const styles = getComputedStyle(text);

		expect(styles.getPropertyValue('display')).toBe('none');
	});

	it('should hide text when width is in percentage', () => {
		render(<UnhandledErrorCard dimensions={{ width: '100%', height: 300 }} />);
		const text = screen.getByText("We couldn't load this content");
		const styles = getComputedStyle(text);

		expect(styles.getPropertyValue('display')).toBe('none');
	});

	it('should hide text when height is in percentage', () => {
		render(<UnhandledErrorCard dimensions={{ width: 300, height: '100%' }} />);
		const text = screen.getByText("We couldn't load this content");
		const styles = getComputedStyle(text);

		expect(styles.getPropertyValue('display')).toBe('none');
	});
});
