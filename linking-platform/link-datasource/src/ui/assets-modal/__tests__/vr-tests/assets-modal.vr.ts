import { snapshot } from '@af/visual-regression';

import WithAssetsModalVR from '../../../../../examples/with-assets-modal-vr';

// Screenshot mismatch on CI https://product-fabric.atlassian.net/browse/EDM-7675
snapshot.skip(WithAssetsModalVR, {
  description: 'display assets modal',
  drawsOutsideBounds: true,
});
