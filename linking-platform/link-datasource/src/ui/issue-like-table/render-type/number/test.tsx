import React from 'react';

import { render } from '@testing-library/react';

import NumberType, { NUMBER_TYPE_TEST_ID } from './index';

describe('Number Type', () => {
	const setup = ({ number, ...props }: { [key: string]: any; number: number }) => {
		return render(<NumberType number={number} {...props} />);
	};

	it('should capture and report a11y violations', async () => {
		const number: any = '12';
		const { container } = render(<NumberType number={number} />);

		await expect(container).toBeAccessible();
	});

	it('renders when a positive integer is passed', async () => {
		const { queryByTestId } = setup({
			number: 99,
		});

		const el = queryByTestId(NUMBER_TYPE_TEST_ID);

		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('99');
	});

	it('renders when a negative integer is passed', async () => {
		const { queryByTestId } = setup({
			number: -88,
		});

		const el = queryByTestId(NUMBER_TYPE_TEST_ID);

		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('-88');
	});

	it('renders when a positive decimal is passed', async () => {
		const { queryByTestId } = setup({
			number: 67.49,
		});

		const el = queryByTestId(NUMBER_TYPE_TEST_ID);

		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('67.49');
	});

	it('renders when a negative decimal is passed', async () => {
		const { queryByTestId } = setup({
			number: -69.35,
		});

		const el = queryByTestId(NUMBER_TYPE_TEST_ID);

		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('-69.35');
	});

	it('renders the decimal with correct precision when a long decimal is passed', async () => {
		const { queryByTestId } = setup({
			number: -69.353423423,
		});

		const el = queryByTestId(NUMBER_TYPE_TEST_ID);

		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('-69.353423423');
	});

	it('formats large numbers with commas', async () => {
		const { queryByTestId } = setup({
			number: 10000000123.23,
		});

		const el = queryByTestId(NUMBER_TYPE_TEST_ID);

		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('10,000,000,123.23');
	});

	it('it does not render number type when a non-number type is passed', async () => {
		const number: any = '12';

		const { queryByTestId } = render(<NumberType number={number} />);

		const el = queryByTestId(NUMBER_TYPE_TEST_ID);

		expect(el).not.toBeInTheDocument();
	});

	it('it does not render number type when a no value is passed', async () => {
		const number: any = undefined;

		const { queryByTestId } = render(<NumberType number={number} />);

		const el = queryByTestId(NUMBER_TYPE_TEST_ID);

		expect(el).not.toBeInTheDocument();
	});
});
