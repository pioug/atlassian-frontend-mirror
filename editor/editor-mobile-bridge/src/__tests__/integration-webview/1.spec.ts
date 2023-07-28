/**
 * This is the first entry point for mobile tests.
 * Due to slot limitations with Browserstack App Automate, we had to
 * reduce parallelism and force tests to run into only 3 test files.
 *
 * If you want to only run your test locally, simply comment the other tests bellow
 */
// import compositionEditorTests from './hybrid-editor-tests/composition/_composition-tests';

import basicEditorTestSuite from './hybrid-editor-tests/basics/_basics-tests';
import quickInsertEditorTestSuite from './hybrid-editor-tests/quick-Insert/_quick-insert-tests';
import unsupportedContentEditorTestSuite from './hybrid-editor-tests/unsupported-content/_unsupported-content-tests';
import typeAheadEditorTestSuite from './hybrid-editor-tests/type-ahead/_type-ahead-tests';
import toolbarEditorTestSuite from './hybrid-editor-tests/toolbar/_toolbar-tests';
import smartLinkEditorTestSuite from './hybrid-editor-tests/media/_smart-link-tests';
import placeholderTestSuite from './hybrid-editor-tests/placeholder-text/_placeholder-text-tests';

// compositionEditorTests();
basicEditorTestSuite({ skipTests: {} });
quickInsertEditorTestSuite({ skipTests: {} });
typeAheadEditorTestSuite({ skipTests: {} });
unsupportedContentEditorTestSuite({ skipTests: {} });
toolbarEditorTestSuite({ skipTests: {} });
smartLinkEditorTestSuite({ skipTests: {} });
placeholderTestSuite({ skipTests: {} });
