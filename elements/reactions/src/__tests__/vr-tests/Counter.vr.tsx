import { snapshot } from '@af/visual-regression';

import {
	CounterCompiled,
	CounterUseDarkerFontCompiled,
	CounterUseHighlightCompiled,
	CounterUseUpdatedStylesCompiled,
} from './Counter.fixtures.vr.ap';

snapshot(CounterCompiled);
snapshot(CounterUseHighlightCompiled);
snapshot(CounterUseDarkerFontCompiled);
snapshot(CounterUseUpdatedStylesCompiled);
