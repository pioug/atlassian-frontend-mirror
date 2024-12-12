import UnsupportedNodeAttribute from '../../unsupportedNodeAttribute';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('UnsupportedNodeAttribute', () => {
	const DummyComponent = () => <p>Hello</p>;

	it('should wrap the passed contents in a span', () => {
		const { container } = render(
			<UnsupportedNodeAttribute
				dataAttributes={{ 'data-renderer-mark': true }}
				// eslint-disable-next-line react/no-children-prop
				children={<DummyComponent />}
			/>,
		);
		const spanElement = container.querySelector('span');
		expect(spanElement).toBeInTheDocument();
		expect(spanElement).toHaveAttribute('data-renderer-mark', 'true');
		expect(screen.getByText('Hello')).toBeInTheDocument();
	});
});
