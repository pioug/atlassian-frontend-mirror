import { snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/01-basic';
import DifferentTypes from '../../../../examples/02-different-types';

//Flaky test https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2950669/steps/%7B051e6920-5d2d-4572-be85-86b1e4f7e7d6%7D/test-report
snapshot.skip(Basic);
snapshot(DifferentTypes);
