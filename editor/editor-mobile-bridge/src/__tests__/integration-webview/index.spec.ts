/**
 * This is the entry point and only "test file" for mobile tests.
 * Due to slot limitations with Browserstack App Automate, we had to
 * reduce parallelism and force tests to run into a single file.
 *
 * If you want to only run your test locally, simply comment the other tests bellow
 */
// import compositionEditorTests from './hybrid-editor-tests/composition/_composition-tests';
import mediaEditorTests from './hybrid-editor-tests/media/_media-tests';
import emojiEditorTests from './hybrid-editor-tests/emoji/_emoji-tests';
import quickInsertEditorTests from './hybrid-editor-tests/quick-Insert/_quick-insert-tests';
import unsupportedContentEditorTests from './hybrid-editor-tests/unsupported-content/_unsupported-content-tests';
import mediaRendererTests from './hybrid-renderer-tests/_media-tests';
import smartLinkEditorTests from './hybrid-editor-tests/media/_smart-link-tests';

// compositionEditorTests();
mediaEditorTests();
emojiEditorTests();
quickInsertEditorTests();
unsupportedContentEditorTests();
mediaRendererTests();
smartLinkEditorTests();
