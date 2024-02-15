import { withErrorBoundary } from './error-boundary';
import { withIntlProvider } from './intl-provider';
import JQLEditorUI from './jql-editor';
import { JQLEditorUIProps } from './jql-editor/types';
import { JQLEditorProps } from './types';

export default withIntlProvider<JQLEditorProps>(
  withErrorBoundary<JQLEditorUIProps>(JQLEditorUI),
);
