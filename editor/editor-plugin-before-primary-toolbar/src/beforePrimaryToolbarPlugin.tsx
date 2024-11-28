import React from 'react';

import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';

import type { BeforePrimaryToolbarPlugin } from './beforePrimaryToolbarPluginType';
import { BeforePrimaryToolbarWrapper } from './ui/BeforePrimaryToolbarWrapper';

export const beforePrimaryToolbarPlugin: BeforePrimaryToolbarPlugin = ({ api, config: props }) => {
	const primaryToolbarComponent: ToolbarUIComponentFactory = () => {
		return (
			<BeforePrimaryToolbarWrapper
				beforePrimaryToolbarComponents={props?.beforePrimaryToolbarComponents}
			/>
		);
	};
	api?.primaryToolbar?.actions.registerComponent({
		name: 'beforePrimaryToolbar',
		component: primaryToolbarComponent,
	});

	return {
		name: 'beforePrimaryToolbar',

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};
