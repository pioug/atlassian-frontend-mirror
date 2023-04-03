import { ReactEditorView as BaseReactEditorView } from './ReactEditorViewInternal';
import { injectIntl } from 'react-intl-next';

export class ReactEditorView<T = {}> extends BaseReactEditorView<T> {}

export default injectIntl(ReactEditorView);
