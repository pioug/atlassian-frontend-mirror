/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import type { IntlShape } from 'react-intl';

import { jsx } from '@atlaskit/css';
import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import DockToolbarTopIcon from '@atlaskit/icon-lab/core/dock-toolbar-top';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';
import MinusIcon from '@atlaskit/icon/core/minus';
import HeadingItem from '@atlaskit/menu/heading-item';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

type OverflowToobarConfigOptions = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
	intl: IntlShape;
	toolbarDocking?: 'top' | 'none';
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
					return (
						api?.core.actions.execute(
							api?.userPreferences?.actions?.updateUserPreference?.(
								'toolbarDockingPosition',
								'none',
							),
						) ?? false
					);
				},
				elemBefore: MinusIcon({ label: '' }),
			},
			{
				content: intl.formatMessage(selectionToolbarMessages.toolbarPositionFixedAtTop),
				value: {
					name: 'fixed',
				},
				onClick: () => {
					return (
						api?.core.actions.execute(
							api?.userPreferences?.actions?.updateUserPreference?.(
								'toolbarDockingPosition',
								'top',
							),
						) ?? false
					);
				},
				isActive: true,
				elemBefore: DockToolbarTopIcon({ label: '' }),
				elemAfter: <CheckMarkIcon label="" size="small" />,
			},
		],
	},
];
