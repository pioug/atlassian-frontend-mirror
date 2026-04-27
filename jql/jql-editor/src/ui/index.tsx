import { withErrorBoundary } from './error-boundary';
import { withIntlProvider } from './intl-provider';
import JQLEditorUI from './jql-editor';
import { type JQLEditorUIProps } from './jql-editor/types';
import { type JQLEditorProps } from './types';

const _default_1: (props: JQLEditorProps) => React.JSX.Element = withIntlProvider<JQLEditorProps>(withErrorBoundary<JQLEditorUIProps>(JQLEditorUI));
export default _default_1;
