import React, { useEffect } from 'react';

import { render } from '@testing-library/react';

import useStableRef from '../use-stable-ref';

// Checking that value in the ref is not updated in the render pass,
// but after in an effect after the render.
it('should update values after an effect', () => {
	const ordered: string[] = [];
	function App({ name }: { name: string }) {
		const ref = useStableRef(name);

		ordered.push(`render(prop):${name}`);
		ordered.push(`render(stored):${ref.current}`);

		useEffect(() => {
			ordered.push(`effect(prop):${name}`);
			ordered.push(`effect(stored):${ref.current}`);
		});

		return <div>hi</div>;
	}

	const { rerender } = render(<App name="Alex" />);

	expect(ordered).toEqual([
		// In the initial render, our stored
		// value is the same as the render pass
		'render(prop):Alex',
		'render(stored):Alex',
		// values synced in the effect, but not changed
		// for this initial render
		'effect(prop):Alex',
		'effect(stored):Alex',
	]);
	ordered.length = 0;

	rerender(<App name="Declan" />);

	expect(ordered).toEqual([
		// values are different in the render pass
		'render(prop):Declan',
		'render(stored):Alex',
		// but are synced in the effect
		'effect(prop):Declan',
		'effect(stored):Declan',
	]);
	ordered.length = 0;

	rerender(<App name="Michael" />);

	expect(ordered).toEqual([
		// values are different in the render pass
		'render(prop):Michael',
		'render(stored):Declan',
		// but are synced in the effect
		'effect(prop):Michael',
		'effect(stored):Michael',
	]);
});
