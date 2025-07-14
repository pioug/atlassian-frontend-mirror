import { snapshot } from '@af/visual-regression';
import {
	TableRenderer,
	TableRendererWideOverflow,
	TableRendererFullWidthOverflow,
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
	TableRendererWithNumberedColumnFullWidth,
	TableRendereWithNumberedColumnFullPage,
	TableRendererWithNumberedColumnComment,
	TableRendererWithNumberedColumnWithoutAppearance,
} from './table.fixture';
import {
	TableRendererOverflow,
	TableRendererWithInlineComments,
} from '../__helpers/rendererComponents';

snapshot(TableRenderer, {
	description: 'Table renderer should NOT render a right shadow',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererWithNumberedColumnFullWidth, {
	description: 'Table renderer should render numbered column',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererOverflow, {
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererWideOverflow, {
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererFullWidthOverflow, {
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});

snapshot(TableRendererWithInlineComments, {
	description: 'Table renderer should render inline comment over right overflow shadow',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererWrappedNodes, {
	description: 'Table renderer should NOT overflow inline nodes when table columns are narrow',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererComplexNodes, {
	description: 'Table renderer should render complex nodes in table cells',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(TableRendererBackgroundColor, {
	description: 'Table renderer should render all table cell background colors correctly',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});

snapshot(TableRendereWithNumberedColumnFullPage, {
	description: 'Table renderer should render numbered column in full page',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});

snapshot(TableRendererFullWidthComment, {
	description: 'Table Comment renderer should render full-with table',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererWideComment, {
	description: 'Table Comment renderer should render wide table',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});

snapshot(TableRendererWithNumberedColumnComment, {
	description: 'Table Comment renderer should render numbered column',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});

snapshot(TableRendererComment, {
	description: 'Table Comment renderer should render default table',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(WideTableRendererFullWidth, {
	description: 'Table Full-width renderer should render wide table',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(FullWidthTableRendererFullWidth, {
	description: 'Table Full-width renderer should render full-with table',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererWithoutAppearance, {
	description: 'Table renderer without appearance should render default table',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererWideWithoutAppearance, {
	description: 'Table renderer without appearance should render wide table',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererFullWidthWithoutAppearance, {
	description: 'Table renderer without appearance should render full-with table',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
snapshot(TableRendererWithNumberedColumnWithoutAppearance, {
	description: 'Table renderer without apperance should render numbered column',
	featureFlags: {
		'platform-ssr-table-resize': [true, false],
	},
});
