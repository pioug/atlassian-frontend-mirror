/**
 * This is the first entry point for mobile tests.
 * Due to slot limitations with Browserstack App Automate, we had to
 * reduce parallelism and force tests to run into only 3 test files.
 *
 * If you want to only run your test locally, simply comment the other tests bellow
 */
// import compositionEditorTests from './hybrid-editor-tests/composition/_composition-tests';
import mediaEditorTests from './hybrid-editor-tests/media/_media-tests';
import emojiEditorTests from './hybrid-editor-tests/emoji/_emoji-tests';
import basicEditorTests from './hybrid-editor-tests/basics/_basics-tests';
import quickInsertEditorTests from './hybrid-editor-tests/quick-Insert/_quick-insert-tests';
import unsupportedContentEditorTests from './hybrid-editor-tests/unsupported-content/_unsupported-content-tests';
import typeAheadEditorTests from './hybrid-editor-tests/type-ahead/_type-ahead-tests';
import toolbarEditorTests from './hybrid-editor-tests/toolbar/_toolbar-tests';

// compositionEditorTests();
mediaEditorTests();
emojiEditorTests();
basicEditorTests();
quickInsertEditorTests();
typeAheadEditorTests();
unsupportedContentEditorTests();
toolbarEditorTests();
