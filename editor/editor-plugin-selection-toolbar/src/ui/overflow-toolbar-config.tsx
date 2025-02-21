/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import { css, jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

import type { Command, FloatingToolbarItem } from '@atlaskit/editor-common/types';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { HeadingItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

import { ContextualToolbarIcon } from './icons/ContextualToolbarIcon';
import { FixedToolbarIcon } from './icons/FixedToolbarIcon';

type OverflowToobarConfigOptions = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
};

// New editor controls
export const getOverflowFloatingToolbarConfig = ({
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

export const getOverflowPrimaryToolbarConfig = ({
	api,
}: OverflowToobarConfigOptions): { items: MenuItem[] }[] => [
	{
		items: [
			{
				content: (
					// eslint-disable-next-line @atlaskit/design-system/use-primitives
					<div css={headingContainerStyles}>
						<HeadingItem>Toolbar position</HeadingItem>
					</div>
				),
				value: {
					name: '',
				},
				isDisabled: true,
			},
			{
				content: 'Contextual',
				value: {
					name: 'contextual',
				},
				onClick: () => {
					return api?.selectionToolbar.actions?.setToolbarDocking?.('none') ?? false;
				},
			},
			{
				content: 'Fixed at top',
				value: {
					name: 'fixed',
				},
				onClick: () => {
					return api?.selectionToolbar.actions?.setToolbarDocking?.('top') ?? false;
				},
			},
		],
	},
];

const headingContainerStyles = css({
	padding: `${token('space.100')} 0`,
	margin: `${token('space.negative.100')} 0`,
});
