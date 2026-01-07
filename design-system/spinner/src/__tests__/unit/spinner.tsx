import React from 'react';

import { render, screen } from '@testing-library/react';

import Spinner from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<Spinner />', () => {
	const testId = 'spinner';

	it('should render the spinner at a custom size', () => {
		render(<Spinner size={4000} testId={testId} />);

		const el = screen.getByTestId(testId);

		expect(el).toHaveAttribute('width', '4000');
		expect(el).toHaveAttribute('height', '4000');
		expect(screen.getByTestId('spinner-wrapper')).toHaveStyle('height: 4000px;');
		expect(screen.getByTestId('spinner-wrapper')).toHaveStyle('width: 4000px;');
	});

	it('should forward the ref to the underlying svg', () => {
		const ref = React.createRef<SVGSVGElement>();

		render(<Spinner ref={ref} testId={testId} />);

		expect(screen.getByTestId(testId)).toBe(ref.current);
	});

	it('should have a custom label if `label` prop is used', () => {
		const label = 'label';
		render(<Spinner label={label} testId={testId} />);

		expect(screen.getByTestId(testId)).toHaveAttribute('aria-label', label);
	});

	it('should have role="img" when `label` prop is used', () => {
		const label = 'Loading';
		render(<Spinner label={label} testId={testId} />);

		expect(screen.getByTestId(testId)).toHaveAttribute('role', 'img');
	});

	it('should have role="none" when `label` prop is not used', () => {
		render(<Spinner testId={testId} />);

		expect(screen.getByTestId(testId)).toHaveAttribute('role', 'none');
	});
});
