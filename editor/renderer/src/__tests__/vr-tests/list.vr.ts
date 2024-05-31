import { snapshot } from '@af/visual-regression';
import {
	ListRenderer,
	ListWithCodeblock,
	CustomStartListOrder1,
	CustomStartListOrderMinus1_9,
	CustomStartListOrderMinus3,
	CustomStartListOrder9999,
	CustomStartListOrder999,
	CustomStartListOrder3_9,
	CustomStartListOrder0,
	CustomStartListOrder99,
	RenderUlOlwithSamePadding,
} from './list.fixture';

snapshot(ListRenderer);

snapshot(ListWithCodeblock);

snapshot(CustomStartListOrder1);
snapshot(CustomStartListOrder99);
snapshot(CustomStartListOrder999);
snapshot(CustomStartListOrder9999);
snapshot(CustomStartListOrder0);
snapshot(CustomStartListOrder3_9);
snapshot(CustomStartListOrderMinus3);
snapshot(CustomStartListOrderMinus1_9);

snapshot(RenderUlOlwithSamePadding);
