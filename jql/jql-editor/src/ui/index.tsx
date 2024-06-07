import { withErrorBoundary } from './error-boundary';
import { withIntlProvider } from './intl-provider';
import JQLEditorUI from './jql-editor';
import { type JQLEditorUIProps } from './jql-editor/types';
import { type JQLEditorProps } from './types';

export default withIntlProvider<JQLEditorProps>(withErrorBoundary<JQLEditorUIProps>(JQLEditorUI));
