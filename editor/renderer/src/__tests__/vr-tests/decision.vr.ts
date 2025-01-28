import { snapshot } from '@af/visual-regression';
import { DecisionRenderer, DecisionHoverRenderer, DecisionRendererWithReactLooselyLazy } from './decision.fixture';

snapshot(DecisionRenderer);

snapshot(DecisionRendererWithReactLooselyLazy);

snapshot(DecisionHoverRenderer, {
	states: [{ state: 'hovered', selector: { byTestId: 'elements-decision-item' } }],
});
