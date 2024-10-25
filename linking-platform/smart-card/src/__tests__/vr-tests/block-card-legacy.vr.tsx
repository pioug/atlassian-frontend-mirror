import { snapshot } from '@af/visual-regression';

import BlockCardActionsMenu from '../../../examples/vr-block-card-legacy/vr-block-card-actions-menu';
import BlockCardCollaborators from '../../../examples/vr-block-card-legacy/vr-block-card-collaborators';
import BlockCardFlexibleViews from '../../../examples/vr-block-card-legacy/vr-block-card-flexible-views';
import BlockCardLozenge from '../../../examples/vr-block-card-legacy/vr-block-card-lozenge';
import BlockCardPreview from '../../../examples/vr-block-card-legacy/vr-block-card-preview';

snapshot(BlockCardFlexibleViews);

snapshot(BlockCardActionsMenu, { drawsOutsideBounds: true });

snapshot(BlockCardCollaborators);
snapshot(BlockCardLozenge);
snapshot(BlockCardPreview);
