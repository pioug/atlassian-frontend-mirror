import React from 'react';

import { render, screen } from '@testing-library/react';

import Heading, { HeadingContextProvider } from '../../src';

describe('Heading', () => {
	it('renders', () => {
		render(
			<Heading size="xxsmall" testId="test">
				Hello
			</Heading>,
		);

		expect(screen.getByTestId('test')).toBeInTheDocument();
	});

	it('sets size based on nesting', () => {
		render(
			<HeadingContextProvider value={5}>
				<Heading size="xxsmall" testId="test">
					Hello
				</Heading>
			</HeadingContextProvider>,
		);

		expect(screen.getByTestId('test').tagName).toEqual('H5');
	});

	it('sets min size if with user provided value exceeding range', () => {
		render(
			// @ts-expect-error invalid nesting still produces valid dom element
			<HeadingContextProvider value={10}>
				<Heading size="xxsmall" testId="test">
					Hello
				</Heading>
			</HeadingContextProvider>,
		);

		expect(screen.getByTestId('test').tagName).toEqual('DIV');
	});

	it('observes deeper context', () => {
		// should be H2 --> H3 --> H4
		render(
			<HeadingContextProvider value={2}>
				<HeadingContextProvider>
					<Heading size="xxsmall" testId="h3">
						Hello
					</Heading>
					<HeadingContextProvider>
						<Heading size="xxsmall" testId="h4">
							Hello
						</Heading>
					</HeadingContextProvider>
				</HeadingContextProvider>
			</HeadingContextProvider>,
		);

		expect(screen.getByTestId('h3').tagName).toEqual('H3');
		expect(screen.getByTestId('h4').tagName).toEqual('H4');
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLHeadingElement>();
		render(
			<Heading size="medium" ref={ref}>
				Hello, Atlassian!
			</Heading>,
		);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, Atlassian!');
	});
});
