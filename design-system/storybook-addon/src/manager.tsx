import { addons, types } from '@storybook/manager-api';

import { ADDON_ID, TITLE, TOOL_ID } from './constants';
import Tool from './tool';

addons.register(ADDON_ID, () => {
	addons.add(TOOL_ID, {
		type: types.TOOL,
		title: TITLE,
		match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
		render: Tool,
	});
});
