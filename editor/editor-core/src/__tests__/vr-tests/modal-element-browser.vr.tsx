import { snapshot } from '@af/visual-regression';

import ElementBrowserModal from './elementBrowserModalComponent';

// there is subtle difference in how unicode symbol ⏎ (inside search input in this component) shows up on pipeline and locally
// including snapshot generated from pipeline with this test
snapshot(ElementBrowserModal);
