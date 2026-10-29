import React, { useSyncExternalStore } from 'react';

import { renderToStaticMarkup } from 'react-dom/server';

test('a null server snapshot renders the component fallback instead of opting out of SSR', () => {
	let renders = 0;
	const getServerSnapshot = jest.fn(() => null);
	const subscribe = () => () => {};
	const getSnapshot = () => 'Client data';
	function Status() {
		renders++;
		const value = useSyncExternalStore<string | null>(subscribe, getSnapshot, getServerSnapshot);
		return <span>{value === null ? 'Server fallback' : value}</span>;
	}

	expect(renderToStaticMarkup(<Status />)).toBe('<span>Server fallback</span>');
	expect(renders).toBe(1);
	expect(getServerSnapshot).toHaveBeenCalled();
});
