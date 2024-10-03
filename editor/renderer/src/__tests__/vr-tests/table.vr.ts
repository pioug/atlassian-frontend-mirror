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
	TableRendererWithoutAppearance,
	TableRendererWideWithoutAppearance,
	TableRendererFullWidthWithoutAppearance,
} from './table.fixture';

snapshot(TableRenderer, {
	description: 'Table renderer should NOT render a right shadow',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(TableRendererOverflow, {
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(TableRendererWideOverflow, {
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(TableRendererFullWidthOverflow, {
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});

snapshot(TableRendererWithInlineComments, {
	description: 'Table renderer should render inline comment over right overflow shadow',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(TableRendererWrappedNodes, {
	description: 'Table renderer should NOT overflow inline nodes when table columns are narrow',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(TableRendererComplexNodes, {
	description: 'Table renderer should render complex nodes in table cells',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});

snapshot(TableRendererBackgroundColor, {
	description: 'Table renderer should render all table cell background colors correctly',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});

snapshot(TableRendererFullWidthComment, {
	description: 'Table Comment renderer should render full-with table',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(TableRendererWideComment, {
	description: 'Table Comment renderer should render wide table',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(TableRendererComment, {
	description: 'Table Comment renderer should render default table',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(WideTableRendererFullWidth, {
	description: 'Table Full-width renderer should render wide table',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(FullWidthTableRendererFullWidth, {
	description: 'Table Full-width renderer should render full-with table',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(TableRendererWithoutAppearance, {
	description: 'Table renderer without appearance should render default table',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(TableRendererWideWithoutAppearance, {
	description: 'Table renderer without appearance should render wide table',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
snapshot(TableRendererFullWidthWithoutAppearance, {
	description: 'Table renderer without appearance should render full-with table',
	featureFlags: {
		'platform-fix-table-ssr-resizing': [true, false],
	},
});
