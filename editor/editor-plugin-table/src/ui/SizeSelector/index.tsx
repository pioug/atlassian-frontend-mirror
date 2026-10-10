/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

/* eslint-disable @typescript-eslint/consistent-type-imports, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic */
import { jsx } from '@emotion/react';

import { TableSelectorPopup } from '@atlaskit/editor-common/TableSelector';
import type { TableSelectorPopupProps } from '@atlaskit/editor-common/TableSelector';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';

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
}: SizeSelectorProps): jsx.JSX.Element => {
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
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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
