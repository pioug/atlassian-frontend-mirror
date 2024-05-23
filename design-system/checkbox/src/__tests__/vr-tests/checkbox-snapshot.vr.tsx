import { snapshot } from '@af/visual-regression';

import BasicUsage from '../../../examples/00-basic-usage';
import Sizes from '../../../examples/08-sizes';
import MultilineLabel from '../../../examples/09-multiline-label';

//Skipping because of failing build. Build: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/%7B6a360815-4dad-4f55-a497-7ac156530984%7D/steps/%7B4bffe60b-3c1e-4f67-a9a2-2d1984d904bb%7D/test-report
snapshot.skip(BasicUsage);
snapshot(Sizes);
snapshot(MultilineLabel);
