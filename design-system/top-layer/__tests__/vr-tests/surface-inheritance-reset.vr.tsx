import { snapshot } from '@af/visual-regression';

import SurfaceInheritanceReset from '../../examples/81-vr-surface-inheritance-reset';

// Guards the top-layer "surface reset": a popover rendered inline under a
// `white-space: nowrap` ancestor must still wrap its own content (the reset
// neutralises inherited text-layout properties). A regression re-introduces a
// single-line overflow. See src/popover/popover.tsx `styles.root`.
snapshot(SurfaceInheritanceReset, { drawsOutsideBounds: true });
