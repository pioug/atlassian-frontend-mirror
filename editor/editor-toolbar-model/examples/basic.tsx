import React from 'react';

import {
	Toolbar,
	ToolbarButtonGroup,
	ToolbarSection,
	ToolbarDropdownItemSection,
} from '@atlaskit/editor-toolbar';
import {
	ToolbarModelRenderer,
	createComponentRegistry,
	type RegisterToolbar,
} from '@atlaskit/editor-toolbar-model';

import {
	registerAIToolbarComponents,
	registerTextFormattingToolbarComponents,
	registerTextStylesToolbarComponents,
	registerTextColorToolbarComponents,
	registerListsToolbarComponents,
	registerLinkToolbarComponents,
	registerCommentToolbarComponents,
	registerOverflowToolbarComponents,
	registerBlockTypeToolbarComponents,
} from './helpers/toolbar-components-definition';

const toolbar: Array<RegisterToolbar> = [
	{
		type: 'toolbar',
		key: 'selection-toolbar',
		component: (props) => {
			return <Toolbar label={'Selection toolbar'}>{props.children}</Toolbar>;
		},
	},
];

const allComponents = [
	registerBlockTypeToolbarComponents,
	registerAIToolbarComponents,
	registerTextStylesToolbarComponents,
	registerTextFormattingToolbarComponents,
	registerTextColorToolbarComponents,
	registerListsToolbarComponents,
	registerLinkToolbarComponents,
	registerCommentToolbarComponents,
	registerOverflowToolbarComponents,
];

export default function Basic(): React.JSX.Element {
	const registry = createComponentRegistry();

	allComponents.forEach((registerComponents) => {
		registry.register(registerComponents());
	});

	registry.register(toolbar);

	return (
		<ToolbarModelRenderer
			components={registry.components}
			toolbar={toolbar[0]}
			fallbacks={{
				group: ToolbarButtonGroup,
				section: ToolbarSection,
				menuSection: ToolbarDropdownItemSection,
			}}
		/>
	);
}
