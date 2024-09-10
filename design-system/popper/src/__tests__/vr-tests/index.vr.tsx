import { snapshot } from '@af/visual-regression';

import AdvancedBehaviors from '../../../examples/02-advanced-behaviors';
import {
	MaxSizeBottomExample,
	MaxSizeLeftExample,
	MaxSizeRightExample,
	MaxSizeTopExample,
} from '../../../examples/03-max-size';

snapshot(AdvancedBehaviors);

snapshot(MaxSizeTopExample, { drawsOutsideBounds: true });
snapshot(MaxSizeBottomExample, { drawsOutsideBounds: true });
snapshot(MaxSizeLeftExample, { drawsOutsideBounds: true });
snapshot(MaxSizeRightExample, { drawsOutsideBounds: true });
