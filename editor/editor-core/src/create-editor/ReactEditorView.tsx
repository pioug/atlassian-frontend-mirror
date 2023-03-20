import { ReactEditorView as BaseReactEditorView } from './ReactEditorViewInternal';
import getEditorPlugins from '../utils/get-editor-plugins';
import { injectIntl } from 'react-intl-next';

export class ReactEditorView<T = {}> extends BaseReactEditorView<T> {
  // We add getEditorPlugins by default here for external packages
  // using ReactEditorView that are using an optional `getEditorPlugins`.
  // This will ensure it will use the default behaviour
  static defaultProps = {
    getEditorPlugins,
  };
}

export default injectIntl(ReactEditorView);
