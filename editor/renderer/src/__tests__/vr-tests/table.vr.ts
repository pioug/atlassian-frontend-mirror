import { Device, snapshot } from '@af/visual-regression';
import { flagsForVrTestsWithReducedPadding } from '@atlaskit/editor-test-helpers/advanced-layouts-flags';
import {
	TableRenderer,
	TableRendererWideOverflow,
	TableRendererFullWidthOverflow,
	TableRendererWrappedNodes,
	TableRendererComplexNodes,
	TableRendererBackgroundColor,
	LegacyPaletteRenderer,
	ExpandedPaletteRenderer,
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
} from './table.fixture.vr.ap';
import {
	TableRendererOverflow,
	TableRendererWithInlineComments,
} from '../__helpers/rendererComponents.vr.ap';

snapshot(TableRenderer, {
	description: 'Table renderer should NOT render a right shadow',
});
snapshot(TableRendererWithNumberedColumnFullWidth, {
	description: 'Table renderer should render numbered column',
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
});

snapshot(LegacyPaletteRenderer, {
	description: 'Table renderer should render selectable legacy background colors',
	featureFlags: {
		platform_editor_lovability_text_bg_color: false,
		platform_editor_lovability_text_bg_color_patch_2: true,
	},
});

snapshot(ExpandedPaletteRenderer, {
	description: 'Table renderer should render selectable expanded background colors',
	featureFlags: {
		platform_editor_lovability_text_bg_color: true,
		platform_editor_lovability_text_bg_color_patch_2: true,
	},
});

snapshot(TableRendereWithNumberedColumnFullPage, {
	description: 'Table renderer should render numbered column in full page',
});

snapshot(TableRendererFullWidthComment, {
	description: 'Table Comment renderer should render full-with table',
});
snapshot(TableRendererWideComment, {
	description: 'Table Comment renderer should render wide table',
});

snapshot(TableRendererWithNumberedColumnComment, {
	description: 'Table Comment renderer should render numbered column',
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
snapshot(TableRendererWithoutAppearance, {
	description: 'Table renderer without appearance should render default table',
});
snapshot(TableRendererWideWithoutAppearance, {
	description: 'Table renderer without appearance should render wide table',
});
snapshot(TableRendererFullWidthWithoutAppearance, {
	description: 'Table renderer without appearance should render full-with table',
});
snapshot(TableRendererWithNumberedColumnWithoutAppearance, {
	description: 'Table renderer without apperance should render numbered column',
});

snapshot(TableRendererOverflow, {
	...flagsForVrTestsWithReducedPadding,
	description: 'full-page renderer should have 24px padding on narrow screen',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});

snapshot(FullWidthTableRendererFullWidth, {
	...flagsForVrTestsWithReducedPadding,
	description: 'full-width renderer should have no padding on narrow screen',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});
