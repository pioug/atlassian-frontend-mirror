/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { Command, FloatingToolbarItem } from '@atlaskit/editor-common/types';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

import { ContextualToolbarIcon } from './icons/ContextualToolbarIcon';
import { FixedToolbarIcon } from './icons/FixedToolbarIcon';

type OverflowToobarConfigOptions = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
};

// New editor controls
export const getOverflowToolbarConfig = ({
	api,
}: OverflowToobarConfigOptions): FloatingToolbarItem<Command>[] => [
	{ type: 'separator' },
	{
		type: 'overflow-dropdown',
		options: [
			{
				type: 'separator',
			},
			{
				type: 'overflow-dropdown-heading',
				title: 'Toolbar position',
			},
			{
				title: 'Contextual',
				onClick: () => {
					return api?.selectionToolbar.actions?.setToolbarDocking?.('none') ?? false;
				},
				icon: <ContextualToolbarIcon label="Contextual toolbar" />,
			},
			{
				title: 'Fixed at top',
				onClick: () => {
					return api?.selectionToolbar.actions?.setToolbarDocking?.('top') ?? false;
				},
				icon: <FixedToolbarIcon label="Fixed toolbar" />,
			},
		],
	},
];
