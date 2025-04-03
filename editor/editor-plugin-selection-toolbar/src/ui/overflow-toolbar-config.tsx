/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import { IntlShape } from 'react-intl-next';

import { jsx } from '@atlaskit/css';
import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
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
	intl: IntlShape;
};

// New editor controls
export const getOverflowFloatingToolbarConfig = ({
	api,
	toolbarDocking,
	intl,
}: OverflowToobarConfigOptions): FloatingToolbarItem<Command>[] => {
	const isDockedToTop = toolbarDocking === 'top';

	const dropdownOptions: FloatingToolbarOverflowDropdownOptions<Command> = [
		{
			type: 'overflow-dropdown-heading',
			title: intl.formatMessage(selectionToolbarMessages.toolbarAppears),
		},
		{
			title: intl.formatMessage(selectionToolbarMessages.toolbarPositionInline),
			onClick: () => {
				return api?.selectionToolbar.actions?.setToolbarDocking?.('none') ?? false;
			},
			icon: MinusIcon({ label: '' }),
			selected: !isDockedToTop,
			elemAfter: !isDockedToTop ? <CheckMarkIcon label="" /> : undefined,
		},
		{
			title: intl.formatMessage(selectionToolbarMessages.toolbarPositionFixedAtTop),
			onClick: () => {
				return api?.selectionToolbar.actions?.setToolbarDocking?.('top') ?? false;
			},
			icon: DockToolbarTopIcon({ label: '' }),
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
	intl,
}: OverflowToobarConfigOptions): { items: MenuItem[] }[] => [
	{
		items: [
			{
				content: (
					<HeadingItem>{intl.formatMessage(selectionToolbarMessages.toolbarAppears)}</HeadingItem>
				),
				value: {
					name: '',
				},
				isDisabled: true,
			},
			{
				content: intl.formatMessage(selectionToolbarMessages.toolbarPositionInline),
				value: {
					name: 'contextual',
				},
				onClick: () => {
					return api?.selectionToolbar.actions?.setToolbarDocking?.('none') ?? false;
				},
				elemBefore: MinusIcon({ label: '' }),
			},
			{
				content: intl.formatMessage(selectionToolbarMessages.toolbarPositionFixedAtTop),
				value: {
					name: 'fixed',
				},
				onClick: () => {
					return api?.selectionToolbar.actions?.setToolbarDocking?.('top') ?? false;
				},
				isActive: true,
				elemBefore: DockToolbarTopIcon({ label: '' }),
				elemAfter: <CheckMarkIcon label="" />,
			},
		],
	},
];
