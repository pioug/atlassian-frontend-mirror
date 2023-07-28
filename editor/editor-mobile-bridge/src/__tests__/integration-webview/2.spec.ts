/**
 * This is the second entry point for mobile tests.
 * Due to slot limitations with Browserstack App Automate, we had to
 * reduce parallelism and force tests to run into only 3 test files.
 *
 * If you want to only run your test locally, simply comment the other tests bellow
 */
import mediaRendererTests from './hybrid-renderer-tests/_media-tests';
import smartLinkRendererTests from './hybrid-renderer-tests/_smart-link-tests';
// import mediaGroupTests from './hybrid-editor-tests/media/_media-group-test';
import basicRendererTests from './hybrid-renderer-tests/_basics-tests';
import mediaEditorTests from './hybrid-editor-tests/media/_media-tests';
import emojiEditorTests from './hybrid-editor-tests/emoji/_emoji-tests';
import tableEditorTests from './hybrid-editor-tests/table/_table-tests';

mediaRendererTests({});
smartLinkRendererTests({});
// mediaGroupTests(); Fix in MEX-1042
basicRendererTests({});
mediaEditorTests({});
emojiEditorTests({});
tableEditorTests({});
