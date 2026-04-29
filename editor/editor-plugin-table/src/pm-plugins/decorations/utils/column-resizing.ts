import type { IntlShape } from 'react-intl';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { TableDecorations } from '../../../types';
import { createResizeHandleDecoration, updateDecorations } from '../../utils/decoration';

import { composeDecorations } from './compose-decorations';
import type { DecorationTransformer } from './types';

const updateColumnResizeHandle =
	(columnResizesDecorations: Decoration[]): DecorationTransformer =>
	({ decorationSet, tr }) =>
		updateDecorations(
			tr.doc,
			decorationSet,
			columnResizesDecorations,
			TableDecorations.COLUMN_RESIZING_HANDLE_WIDGET,
		);

export const buildColumnResizingDecorations =
	(
		rowEndIndex: number,
		columnEndIndex: number,
		includeTooltip: boolean,
		getIntl: () => IntlShape,
		nodeViewPortalProviderAPI: PortalProviderAPI,
	): DecorationTransformer =>
	({ tr, decorationSet }): DecorationSet => {
		const columnResizesDecorations =
			columnEndIndex < 0
				? []
				: createResizeHandleDecoration(
						tr,
						rowEndIndex,
						{
							right: columnEndIndex,
						},
						includeTooltip,
						getIntl,
						nodeViewPortalProviderAPI,
					);

		return composeDecorations([updateColumnResizeHandle(columnResizesDecorations)])({
			decorationSet,
			tr,
		});
	};

export const clearColumnResizingDecorations =
	(): DecorationTransformer =>
	({ tr, decorationSet }): DecorationSet => {
		return composeDecorations([updateColumnResizeHandle([])])({ decorationSet, tr });
	};
