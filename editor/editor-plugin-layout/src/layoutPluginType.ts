import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

import type { insertLayoutColumnsWithAnalytics } from './pm-plugins/actions';
import { pluginKey } from './pm-plugins/plugin-key';
import type { LayoutPluginOptions } from './types';

export { pluginKey };

export type LayoutPlugin = NextEditorPlugin<
	'layout',
	{
		pluginConfiguration: LayoutPluginOptions | undefined;
		dependencies: [
			DecorationsPlugin,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<WidthPlugin>,
			OptionalPlugin<EditorDisabledPlugin>,
		];
		actions: {
			insertLayoutColumns: ReturnType<typeof insertLayoutColumnsWithAnalytics>;
		};
	}
>;
