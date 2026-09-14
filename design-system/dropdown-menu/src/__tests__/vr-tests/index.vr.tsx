import { snapshot } from '@af/visual-regression';

import DropdownSpacing from '../../../examples/10-dropdown-spacing.vr.ap';
import CustomZIndex from '../../../examples/20-setting-z-index.vr.ap';
import Loading from '../../../examples/93-testing-is-loading-reposition.vr.ap';
import ComplexDropdown from '../../../examples/99-testing-complex-dropdown-menu.vr.ap';
import TestingPlacements from '../../../examples/99-testing-placements.vr.ap';

snapshot(TestingPlacements);
snapshot(DropdownSpacing);
snapshot(ComplexDropdown, { drawsOutsideBounds: true });
snapshot(CustomZIndex, { drawsOutsideBounds: true });
snapshot(Loading, { drawsOutsideBounds: true });
