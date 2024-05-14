import { snapshot } from '@af/visual-regression';

import DefaultModal from '../../../examples/00-default-modal';
import Appearance from '../../../examples/10-appearance';
import Autofocus from '../../../examples/20-autofocus';
import Form from '../../../examples/45-form';
import FormAsContainer from '../../../examples/46-form-as-container';
import Width from '../../../examples/50-width';
import Scroll from '../../../examples/55-scroll';
import MultiLineTitles from '../../../examples/65-multi-line-titles';

// Fixing failing build: Jira Issue: https://hello.jira.atlassian.cloud/browse/UTEST-1617
snapshot.skip(DefaultModal, {
  drawsOutsideBounds: true,
});
snapshot(Scroll, {
  drawsOutsideBounds: true,
});
// Fixing failing build: Jira Issue: https://hello.jira.atlassian.cloud/browse/UTEST-1617
// https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2954579/steps/%7Bedbc20c8-5a9a-4992-a34a-8e52213d92f8%7D/test-report
snapshot.skip(Form, {
  drawsOutsideBounds: true,
});
// Fixing failing build: Jira Issue: https://hello.jira.atlassian.cloud/browse/UTEST-1617
// https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2953062/steps/%7B4a621c2e-0953-41cb-8694-45c5d546f636%7D/test-report
snapshot.skip(FormAsContainer);
snapshot(Autofocus, {
  drawsOutsideBounds: true,
});
snapshot(Appearance, {
  drawsOutsideBounds: true,
});
snapshot(Width, {
  drawsOutsideBounds: true,
});
snapshot(MultiLineTitles, {
  drawsOutsideBounds: true,
});
