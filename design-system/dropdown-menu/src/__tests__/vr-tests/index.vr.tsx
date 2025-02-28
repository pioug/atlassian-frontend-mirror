import { snapshot } from '@af/visual-regression';

import DropdownSpacing from '../../../examples/10-dropdown-spacing';
import CustomZIndex from '../../../examples/20-setting-z-index';
import Loading from '../../../examples/93-testing-is-loading-reposition';
import ComplexDropdown from '../../../examples/99-testing-complex-dropdown-menu';
import TestingPlacements from '../../../examples/99-testing-placements';

snapshot(TestingPlacements);
snapshot(DropdownSpacing);
snapshot(ComplexDropdown, { drawsOutsideBounds: true });
snapshot(CustomZIndex, { drawsOutsideBounds: true });
snapshot(Loading, { drawsOutsideBounds: true });
