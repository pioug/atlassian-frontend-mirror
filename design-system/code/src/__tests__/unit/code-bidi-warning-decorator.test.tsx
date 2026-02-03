import React from 'react';

import { render, screen } from '@testing-library/react';

import { codeSnippets } from '../../../examples/example-data/bidi-examples';
import codeBidiWarningDecorator from '../../bidi-warning/bidi-warning-decorator';

describe('CodeBidiWarningDecorator', () => {
	const id = 'id';

	// custom test component to make the snapshots easier to read
	// @ts-ignore
	const DemoComponent = (props: { bidiCharacter: string }) => {
		const hexCodePoint = props.bidiCharacter.codePointAt(0)!.toString(16);

		return <div data-testid={id}>[u{hexCodePoint}]</div>;
	};

	test.each(Object.entries(codeSnippets))(
		'Adds decoration to %s example',
		(_codeSnippetName, codeSnippet) => {
			const decoratedExampleCode = codeBidiWarningDecorator(
				codeSnippet,
				// @ts-ignore
				DemoComponent,
			);

			render(<>{decoratedExampleCode}</>);

			expect(screen.getAllByTestId(id).length).toBeGreaterThan(0);
		},
	);
});
