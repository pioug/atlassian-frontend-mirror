import React from 'react';

import { createComponentRegistry } from '@atlaskit/editor-toolbar-model/create-registry';
import { ToolbarModelRenderer } from '@atlaskit/editor-toolbar-model/toolbar-model-renderer';
import type { RegisterToolbar } from '@atlaskit/editor-toolbar-model/types';
import { Toolbar } from '@atlaskit/editor-toolbar/toolbar';
import { ToolbarButtonGroup } from '@atlaskit/editor-toolbar/toolbar-button-group';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar/toolbar-dropdown-item-section';
import { ToolbarSection } from '@atlaskit/editor-toolbar/toolbar-section';

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
