import { snapshot } from '@af/visual-regression';

import ElementBrowserModal from './elementBrowserModalComponent';

// there is subtle difference in how unicode symbol ⏎ (inside search input in this component) shows up on pipeline and locally
// including snapshot generated from pipeline with this test
//Skipping due to failing master https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/%7B283af92b-a9df-4fff-bf67-9b2c3169c34c%7D
snapshot.skip(ElementBrowserModal);
