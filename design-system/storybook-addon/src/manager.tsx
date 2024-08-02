// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
import { addons, types } from '@storybook/manager-api';

import { ADDON_ID, TITLE, TOOL_ID } from './constants';
import Tool from './tool';

addons.register(ADDON_ID, () => {
	addons.add(TOOL_ID, {
		type: types.TOOL,
		title: TITLE,
		// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
		match: ({ viewMode }: { viewMode: string | undefined }) =>
			!!(viewMode && viewMode.match(/^(story|docs)$/)),
		render: Tool,
	});
});
