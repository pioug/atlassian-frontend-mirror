/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { jsx } from '@emotion/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TableSelectorPopup, type TableSelectorPopupProps } from '@atlaskit/editor-common/ui';

import { pluginKey } from '../../pm-plugins/table-size-selector';
import type { TablePlugin } from '../../tablePluginType';

interface SizeSelectorProps extends Omit<
	TableSelectorPopupProps,
	'handleClickOutside' | 'onSelection' | 'unUnmount'
> {
	api?: ExtractInjectionAPI<TablePlugin>;
}

const DEFAULT_TABLE_SELECTOR_COLS = 3;
const DEFAULT_TABLE_SELECTOR_ROWS = 3;

export const SizeSelector = ({
	api,
	target,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
}: SizeSelectorProps) => {
	const closeSelectorPopup = useCallback(() => {
		api?.core.actions.execute(({ tr }) => {
			tr.setMeta(pluginKey, {
				isSelectorOpen: false,
			});

			return tr;
		});
	}, [api]);

	const onSelection = useCallback(
		(rowsCount: number, colsCount: number) => {
			api?.core.actions.execute(({ tr }) => {
				api?.table.commands.insertTableWithSize(rowsCount, colsCount)({ tr });

				tr.setMeta(pluginKey, {
					isSelectorOpen: false,
				});

				return tr;
			});
		},
		[api],
	);

	const onUnmount = () => {
		api?.core.actions.focus();
	};

	return (
		<TableSelectorPopup
			defaultSize={{ row: DEFAULT_TABLE_SELECTOR_ROWS, col: DEFAULT_TABLE_SELECTOR_COLS }}
			target={target}
			onUnmount={onUnmount}
			onSelection={onSelection}
			popupsMountPoint={popupsMountPoint}
			popupsScrollableElement={popupsScrollableElement}
			popupsBoundariesElement={popupsBoundariesElement}
			isOpenedByKeyboard={true}
			handleClickOutside={closeSelectorPopup}
			handleEscapeKeydown={closeSelectorPopup}
		/>
	);
};
