import { snapshot } from '@af/visual-regression';
import {
	CounterCompiled,
	CounterUseDarkerFontCompiled,
	CounterUseHighlightCompiled,
	CounterUseUpdatedStylesCompiled,
} from './Counter.fixtures';

snapshot(CounterCompiled);
snapshot(CounterUseHighlightCompiled);
snapshot(CounterUseDarkerFontCompiled);
snapshot(CounterUseUpdatedStylesCompiled);
