import { addons, types } from '@storybook/addons';

import { Tool } from './components';
import { ADDON_ID, TITLE, TOOL_ID } from './constants';

addons.register(ADDON_ID, () => {
	addons.add(TOOL_ID, {
		type: types.TOOL,
		title: TITLE,
		match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
		render: Tool,
	});
});
