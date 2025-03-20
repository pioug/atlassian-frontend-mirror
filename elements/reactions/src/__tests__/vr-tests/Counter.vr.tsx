import { snapshot } from '@af/visual-regression';
import {
	CounterLegacy,
	CounterCompiled,
	CounterUseDarkerFontCompiled,
	CounterUseDarkerFontLegacy,
	CounterUseHighlightCompiled,
	CounterUseHighlightLegacy,
	CounterUseUpdatedStylesCompiled,
	CounterUseUpdatedStylesLegacy,
} from './Counter.fixtures';

snapshot(CounterLegacy);
snapshot(CounterUseHighlightLegacy);
snapshot(CounterUseDarkerFontLegacy);
snapshot(CounterUseUpdatedStylesLegacy);
snapshot(CounterCompiled);
snapshot(CounterUseHighlightCompiled);
snapshot(CounterUseDarkerFontCompiled);
snapshot(CounterUseUpdatedStylesCompiled);
