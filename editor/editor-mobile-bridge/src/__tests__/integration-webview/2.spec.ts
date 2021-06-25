/**
 * This is the second entry point for mobile tests.
 * Due to slot limitations with Browserstack App Automate, we had to
 * reduce parallelism and force tests to run into only 3 test files.
 *
 * If you want to only run your test locally, simply comment the other tests bellow
 */
import mediaRendererTests from './hybrid-renderer-tests/_media-tests';
import smartLinkEditorTests from './hybrid-editor-tests/media/_smart-link-tests';
import smartLinkRendererTests from './hybrid-renderer-tests/_smart-link-tests';
import mediaGroupTests from './hybrid-editor-tests/media/_media-group-test';
import basicRendererTests from './hybrid-renderer-tests/_basics-tests';

mediaRendererTests();
smartLinkEditorTests();
smartLinkRendererTests();
mediaGroupTests();
basicRendererTests();
