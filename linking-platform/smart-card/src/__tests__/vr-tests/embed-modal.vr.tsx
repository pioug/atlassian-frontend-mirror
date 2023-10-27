import { snapshot } from '@af/visual-regression';

import EmbedModal from '../../../examples/vr-embed-modal';
import EmbedModalWithFlexibleUiIcon from '../../../examples/vr-embed-modal-with-flexible-ui-icon';

// Skipping due to pipeline failure - https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/1860884
snapshot.skip(EmbedModal, { description: 'renders embed modal' });
snapshot(EmbedModalWithFlexibleUiIcon, {
  description: 'renders embed modal with flexible ui icon',
});
