import { snapshot } from '@af/visual-regression';

import EmbedModal from '../../../examples/vr-embed-modal';
import EmbedModalWithFlexibleUiIcon from '../../../examples/vr-embed-modal-with-flexible-ui-icon';

snapshot(EmbedModal, { description: 'renders embed modal' });

snapshot(EmbedModalWithFlexibleUiIcon, {
  description: 'renders embed modal with flexible ui icon',
});
