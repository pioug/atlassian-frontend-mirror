import { IntlShape } from 'react-intl-next';

import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { cardPlugin } from '../../index';

export type DatasourceTableLayout = 'full-width' | 'center' | 'wide';

export type LayoutButtonProps = {
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  targetElement?: HTMLElement;
  layout: DatasourceTableLayout;
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
