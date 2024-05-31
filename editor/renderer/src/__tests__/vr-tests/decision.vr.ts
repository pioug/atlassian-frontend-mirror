import { snapshot } from '@af/visual-regression';
import { DecisionRenderer, DecisionHoverRenderer } from './decision.fixture';

snapshot(DecisionRenderer);

snapshot(DecisionHoverRenderer, {
	states: [{ state: 'hovered', selector: { byTestId: 'elements-decision-item' } }],
});
