import type { IntlShape } from 'react-intl-next';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { cardPlugin } from '../../index';

export const DATASOURCE_TABLE_LAYOUTS = [
  'full-width',
  'center',
  'wide',
] as const;

export type DatasourceTableLayout = (typeof DATASOURCE_TABLE_LAYOUTS)[number];

export type LayoutButtonProps = {
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  targetElement?: HTMLElement;
  layout?: DatasourceTableLayout;
  onLayoutChange?: (layout: DatasourceTableLayout) => void;
  testId?: string;
  intl: IntlShape;
};

export interface LayoutButtonWrapperProps
  extends Pick<
    LayoutButtonProps,
    'mountPoint' | 'boundariesElement' | 'scrollableElement'
  > {
  api: ExtractInjectionAPI<typeof cardPlugin> | undefined;
  editorView: EditorView;
}
