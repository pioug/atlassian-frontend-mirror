import { Device, snapshot } from '@af/visual-regression';

import Loading from '../../../../examples/3-loading-state-many-rows.vr.ap';
import EmptyView from '../../../../examples/6-empty-view-with-body.vr.ap';
import Rankable from '../../../../examples/12-with-lots-of-pages-rankable.vr.ap';
import HighlightedRow from '../../../../examples/15-highlighted-row.vr.ap';
import SortableHeaderTruncation from '../../../../examples/19-sortable-header-truncation.vr.ap';
import Basic from '../../../../examples/99-testing.vr.ap';

snapshot(Basic, {
	variants: [
		{ name: 'desktop chrome', device: Device.DESKTOP_CHROME },
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
	],
});

snapshot(EmptyView);

snapshot(SortableHeaderTruncation, {
	description: 'sortable header truncation',
});

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
