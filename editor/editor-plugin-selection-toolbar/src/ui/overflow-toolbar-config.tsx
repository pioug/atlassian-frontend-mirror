/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import { jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

import type {
	Command,
	FloatingToolbarItem,
	FloatingToolbarOverflowDropdownOptions,
} from '@atlaskit/editor-common/types';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import DockToolbarTopIcon from '@atlaskit/icon-lab/core/dock-toolbar-top';
import MinusIcon from '@atlaskit/icon/core/minus';
import CheckMarkIcon from '@atlaskit/icon/utility/check-mark';
import { HeadingItem } from '@atlaskit/menu';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

type OverflowToobarConfigOptions = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
	toolbarDocking?: 'top' | 'none';
};

// New editor controls
export const getOverflowFloatingToolbarConfig = ({
	api,
	toolbarDocking,
}: OverflowToobarConfigOptions): FloatingToolbarItem<Command>[] => {
	const isDockedToTop = toolbarDocking === 'top';

	const dropdownOptions: FloatingToolbarOverflowDropdownOptions<Command> = [
		{
			type: 'overflow-dropdown-heading',
			title: 'Toolbar appears',
		},
		{
			title: 'In-line with text',
			onClick: () => {
				return api?.selectionToolbar.actions?.setToolbarDocking?.('none') ?? false;
			},
			icon: MinusIcon({ label: 'Contextual toolbar' }),
			selected: !isDockedToTop,
			elemAfter: !isDockedToTop ? <CheckMarkIcon label="" /> : undefined,
		},
		{
			title: 'Fixed at top',
			onClick: () => {
				return api?.selectionToolbar.actions?.setToolbarDocking?.('top') ?? false;
			},
			icon: DockToolbarTopIcon({ label: 'Fixed toolbar' }),
			selected: isDockedToTop,
			elemAfter: isDockedToTop ? <CheckMarkIcon label="" /> : undefined,
		},
	];

	return [
		{ type: 'separator', fullHeight: true },
		{
			type: 'overflow-dropdown',
			dropdownWidth: 240,
			options: dropdownOptions,
		},
	];
};

export const getOverflowPrimaryToolbarConfig = ({
	api,
}: OverflowToobarConfigOptions): { items: MenuItem[] }[] => [
	{
		items: [
			{
				content: <HeadingItem>Toolbar appears</HeadingItem>,
				value: {
					name: '',
				},
				isDisabled: true,
			},
			{
				content: 'In-line with text',
				value: {
					name: 'contextual',
				},
				onClick: () => {
					return api?.selectionToolbar.actions?.setToolbarDocking?.('none') ?? false;
				},
				elemBefore: MinusIcon({ label: 'Contextual toolbar' }),
			},
			{
				content: 'Fixed at top',
				value: {
					name: 'fixed',
				},
				onClick: () => {
					return api?.selectionToolbar.actions?.setToolbarDocking?.('top') ?? false;
				},
				isActive: true,
				elemBefore: DockToolbarTopIcon({ label: 'Fixed toolbar' }),
				elemAfter: <CheckMarkIcon label="" />,
			},
		],
	},
];
