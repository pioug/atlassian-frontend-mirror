import { snapshot } from '@af/visual-regression';

import { VrSurfaceColourInheritance } from '../../examples/83-vr-surface-color-inheritance.vr.ap';

const opts = { drawsOutsideBounds: true } as const;

snapshot(VrSurfaceColourInheritance, { ...opts, description: 'surface-color-inheritance' });
