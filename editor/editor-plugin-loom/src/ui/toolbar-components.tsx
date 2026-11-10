import React from 'react';

import {
	LOOM_MENU_SECTION,
	LOOM_MENU_ITEM,
	INSERT_BLOCK_SECTION,
	LOOM_TOOLBAR_GROUP,
	LOOM_TOOLBAR_BUTTON,
	OVERFLOW_MENU_PRIMARY_TOOLBAR,
	OVERFLOW_EXTENSIONS_MENU_SECTION,
} from '@atlaskit/editor-common/toolbar/keys';
import {
	LOOM_MENU_SECTION_RANK,
	LOOM_TOOLBAR_GROUP_RANK,
	INSERT_BLOCK_SECTION_RANK,
	OVERFLOW_MENU_PRIMARY_TOOLBAR_RANK,
	OVERFLOW_EXTENSIONS_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { LoomPlugin } from '../loomPluginType';
import type { LoomPluginOptions } from '../types';
import { LoomMenuItem } from './LoomMenuItem';
import { LoomToolbarButtonGroup } from './LoomToolbarButtonGroup';
import { createToolbarButton, LoomToolbarButtonWrapper } from './LoomToolbarButtonWrapper';
import { MenuSection } from './MenuSection';

export const getToolbarComponents = (
	config: LoomPluginOptions,
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
): RegisterComponent[] => {
	const components: RegisterComponent[] = [
		{
			type: LOOM_MENU_SECTION.type,
			key: LOOM_MENU_SECTION.key,
			parents: [
				{
					type: OVERFLOW_MENU_PRIMARY_TOOLBAR.type,
					key: OVERFLOW_MENU_PRIMARY_TOOLBAR.key,
					rank: OVERFLOW_MENU_PRIMARY_TOOLBAR_RANK[LOOM_MENU_SECTION.key],
				},
			],
			component: ({ children }) => {
				return <MenuSection api={api}>{children}</MenuSection>;
			},
		},
		{
			type: LOOM_MENU_ITEM.type,
			key: LOOM_MENU_ITEM.key,
			parents: [
				{
					type: LOOM_MENU_SECTION.type,
					key: LOOM_MENU_SECTION.key,
					rank: LOOM_MENU_SECTION_RANK[LOOM_MENU_ITEM.key],
				},
				{
					type: OVERFLOW_EXTENSIONS_MENU_SECTION.type,
					key: OVERFLOW_EXTENSIONS_MENU_SECTION.key,
					rank: OVERFLOW_EXTENSIONS_MENU_SECTION_RANK[LOOM_MENU_ITEM.key],
				},
			],
			component: () => {
				return <LoomMenuItem api={api} renderButton={config.renderButton} />;
			},
			isHidden: () => {
				const loomState = api?.loom?.sharedState.currentState();
				const editorViewMode = api?.editorViewMode?.sharedState.currentState() ?? 'edit';
				// if shouldRenderButton is not provided, default to true
				const shouldRenderButton = config?.shouldRenderButton?.() ?? true;

				return (
					('renderButton' in config && shouldRenderButton === false) ||
					loomState?.isEnabled === undefined ||
					editorViewMode !== 'edit'
				);
			},
		},
	];

	if (
		(config.editorAppearance === 'full-page' ||
			config.editorAppearance === 'full-width' ||
			config.editorAppearance === 'max') &&
		isExperimentEnabled('twc_growth_loom_conf_pinned_toolbar')
	) {
		const ButtonComponent = createToolbarButton(api);

		components.push(
			{
				...LOOM_TOOLBAR_GROUP,
				parents: [
					{
						type: INSERT_BLOCK_SECTION.type,
						key: INSERT_BLOCK_SECTION.key,
						rank: INSERT_BLOCK_SECTION_RANK[LOOM_TOOLBAR_GROUP.key],
					},
				],
				component: ({ children }: { children: React.ReactNode }) => (
					<LoomToolbarButtonGroup renderButton={config.renderButton}>
						{children}
					</LoomToolbarButtonGroup>
				),
			},
			{
				...LOOM_TOOLBAR_BUTTON,
				parents: [
					{
						...LOOM_TOOLBAR_GROUP,
						rank: LOOM_TOOLBAR_GROUP_RANK[LOOM_TOOLBAR_BUTTON.key],
					},
				],
				component: () => <LoomToolbarButtonWrapper buttonComponent={ButtonComponent} />,
			},
		);
	}

	return components;
};
