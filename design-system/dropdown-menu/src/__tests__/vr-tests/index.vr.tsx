import { snapshot } from '@af/visual-regression';

import DropdownSpacing from '../../../examples/10-dropdown-spacing';
import ComplexDropdown from '../../../examples/99-testing-complex-dropdown-menu';
import TestingPlacements from '../../../examples/99-testing-placements';

snapshot(TestingPlacements);
snapshot(DropdownSpacing);
snapshot(ComplexDropdown, { drawsOutsideBounds: true });
