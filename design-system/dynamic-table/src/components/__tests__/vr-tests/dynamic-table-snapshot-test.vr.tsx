import { snapshot } from '@af/visual-regression';

import Rankable from '../../../../examples/12-with-lots-of-pages-rankable';
import HighlightedRow from '../../../../examples/15-highlighted-row';
import Loading from '../../../../examples/3-loading-state-many-rows';
import EmptyView from '../../../../examples/6-empty-view-with-body';
import Basic from '../../../../examples/99-testing';

snapshot(Basic);

snapshot(EmptyView);

snapshot(Rankable, {
	description: 'rankable row focus state',
	states: [
		{
			selector: {
				byTestId:
					'my-table--george-washington-1789-1797--rankable--table--row--rankable--table--body--row',
			},
			state: 'focused',
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(Rankable, {
	description: 'rankable row hover state',
	states: [
		{
			selector: {
				byTestId:
					'my-table--george-washington-1789-1797--rankable--table--row--rankable--table--body--row',
			},
			state: 'hovered',
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(HighlightedRow);

snapshot(Loading);
