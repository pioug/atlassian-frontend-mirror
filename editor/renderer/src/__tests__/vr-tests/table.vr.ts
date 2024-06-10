import { snapshot } from '@af/visual-regression';
import {
	TableRenderer,
	TableRendererOverflow,
	TableRendererWideOverflow,
	TableRendererFullWidthOverflow,
	TableRendererWithInlineComments,
	TableRendererWrappedNodes,
	TableRendererComplexNodes,
	TableRendererBackgroundColor,
	TableRendererFullWidthComment,
	TableRendererWideComment,
	TableRendererComment,
	WideTableRendererFullWidth,
	FullWidthTableRendererFullWidth,
} from './table.fixture';

snapshot(TableRenderer, {
	description: 'Table renderer should NOT render a right shadow',
});
snapshot(TableRendererOverflow);
snapshot(TableRendererWideOverflow);
snapshot(TableRendererFullWidthOverflow);

snapshot(TableRendererWithInlineComments, {
	description: 'Table renderer should render inline comment over right overflow shadow',
});
snapshot(TableRendererWrappedNodes, {
	description: 'Table renderer should NOT overflow inline nodes when table columns are narrow',
});
snapshot(TableRendererComplexNodes, {
	description: 'Table renderer should render complex nodes in table cells',
});

snapshot(TableRendererBackgroundColor, {
	description: 'Table renderer should render all table cell background colors correctly',
});

snapshot(TableRendererFullWidthComment, {
	description: 'Table Comment renderer should render full-with table',
});
snapshot(TableRendererWideComment, {
	description: 'Table Comment renderer should render wide table',
});
snapshot(TableRendererComment, {
	description: 'Table Comment renderer should render default table',
});
snapshot(WideTableRendererFullWidth, {
	description: 'Table Full-width renderer should render wide table',
});
snapshot(FullWidthTableRendererFullWidth, {
	description: 'Table Full-width renderer should render full-with table',
});
