import React, { useState } from 'react';

import { act, render } from '@testing-library/react';

import useGeneratedId from '../use-generated-id';

const ComponentWithId = ({ testId }: { testId: string }) => {
	const generatedId = useGeneratedId();
	const [text, setText] = useState('a');

	return (
		<button
			data-testid={testId}
			id={generatedId}
			onClick={() => setText(text + text)}
			type="button"
		>
			{text}
		</button>
	);
};

describe('useGeneratedId', () => {
	it('should generate a unique id each invocation', () => {
		const { getByTestId } = render(
			<>
				<ComponentWithId testId="component1" />
				<ComponentWithId testId="component2" />
			</>,
		);

		const id1 = getByTestId('component1');
		const id2 = getByTestId('component2');

		expect(id1).not.toBe(id2);
	});

	it('should generate the same id for multiple re-renders', () => {
		const { getByTestId } = render(<ComponentWithId testId="component1" />);

		const idOnFirstRender = getByTestId('component1').getAttribute('id');

		act(() => {
			getByTestId('component1').click();
		});

		const idOnSecondRender = getByTestId('component1').getAttribute('id');

		expect(idOnFirstRender).toBe(idOnSecondRender);
	});
});
