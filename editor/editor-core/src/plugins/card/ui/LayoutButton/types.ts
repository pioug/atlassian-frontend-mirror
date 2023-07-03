import { EditorView } from 'prosemirror-view';
import { IntlShape } from 'react-intl-next';
import type cardPlugin from '../../index';
import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

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
