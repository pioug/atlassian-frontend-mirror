import type { IntlShape } from 'react-intl-next';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { cardPlugin } from '../../index';

export const DATASOURCE_TABLE_LAYOUTS = ['full-width', 'center', 'wide'] as const;

export type DatasourceTableLayout = (typeof DATASOURCE_TABLE_LAYOUTS)[number];

export type LayoutButtonProps = {
	boundariesElement?: HTMLElement;
	intl: IntlShape;
	layout?: DatasourceTableLayout;
	mountPoint?: HTMLElement;
	onLayoutChange?: (layout: DatasourceTableLayout) => void;
	scrollableElement?: HTMLElement;
	targetElement?: HTMLElement;
	testId?: string;
};

export interface LayoutButtonWrapperProps extends Pick<
	LayoutButtonProps,
	'mountPoint' | 'boundariesElement' | 'scrollableElement'
> {
	api: ExtractInjectionAPI<typeof cardPlugin> | undefined;
	editorView: EditorView;
}
