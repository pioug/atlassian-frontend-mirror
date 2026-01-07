import React from 'react';

import { queryByAttribute, render, screen } from '@testing-library/react';

import MetricText from '../../metric-text';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('MetricText component', () => {
	it('should render given text', () => {
		render(<MetricText size="medium">Text</MetricText>);
		expect(screen.getByText('Text')).toBeInTheDocument();
	});

	it('should render with given test id', () => {
		render(
			<MetricText size="medium" testId="test">
				Text
			</MetricText>,
		);
		expect(screen.getByTestId('test')).toBeInTheDocument();
	});

	it('should render with id attribute', () => {
		const id = 'some-id';
		const { container } = render(
			<MetricText size="medium" id={id}>
				Text
			</MetricText>,
		);
		const queryById = queryByAttribute.bind(null, 'id');
		const component = queryById(container, id);
		expect(component).toBeDefined();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLSpanElement>();
		render(
			<MetricText size="medium" ref={ref}>
				Hello, world!
			</MetricText>,
		);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});

	describe('"as" prop behaviour', () => {
		it('renders as the correct element with a valid "as" attribute', () => {
			render(
				<>
					<MetricText size="medium">Default</MetricText>
					<MetricText size="medium" as="span">
						Span
					</MetricText>
					<MetricText size="medium" as="div">
						Div
					</MetricText>
				</>,
			);
			expect(screen.getByText('Default').tagName).toBe('SPAN');
			expect(screen.getByText('Span').tagName).toBe('SPAN');
			expect(screen.getByText('Div').tagName).toBe('DIV');
		});

		it('throws with an invalid "as" attribute', () => {
			// Purposefully providing an invalid value to test invariant behaviour
			expect(() =>
				render(
					<MetricText size="medium" as={'address' as any}>
						Text
					</MetricText>,
				),
			).toThrow(
				new Error(
					'Invariant failed: @atlaskit/primitives: MetricText received an invalid "as" value of "address"',
				),
			);
		});
	});
});
