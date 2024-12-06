import React from 'react';

import { queryByAttribute, render, screen } from '@testing-library/react';

import Text from '../../text';

describe('Text component', () => {
	it('should render given text', () => {
		render(<Text>Text</Text>);
		expect(screen.getByText('Text')).toBeInTheDocument();
	});

	it('should render with given test id', () => {
		render(<Text testId="test">Text</Text>);
		expect(screen.getByTestId('test')).toBeInTheDocument();
	});

	it('should render with id attribute', () => {
		const id = 'some-id';
		const { container } = render(<Text id={id}>Text</Text>);
		const queryById = queryByAttribute.bind(null, 'id');
		const component = queryById(container, id);
		expect(component).toBeDefined();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLSpanElement>();
		render(<Text ref={ref}>Hello, world!</Text>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});

	describe('"as" prop behaviour', () => {
		it('renders as the correct element with a valid "as" attribute', () => {
			render(
				<>
					<Text>Default</Text>
					<Text as="span">Span</Text>
					<Text as="p">Paragraph</Text>
					<Text as="strong">Strong</Text>
					<Text as="em">Emphasis</Text>
				</>,
			);
			expect(screen.getByText('Default').tagName).toBe('SPAN');
			expect(screen.getByText('Span').tagName).toBe('SPAN');
			expect(screen.getByText('Paragraph').tagName).toBe('P');
			expect(screen.getByText('Strong').tagName).toBe('STRONG');
			expect(screen.getByText('Emphasis').tagName).toBe('EM');
		});

		it('throws with an invalid "as" attribute', () => {
			// Purposefully providing an invalid value to test invariant behaviour
			expect(() => render(<Text as={'address' as any}>Text</Text>)).toThrow(
				new Error(
					'Invariant failed: @atlaskit/primitives: Text received an invalid "as" value of "address"',
				),
			);
		});
	});
});
