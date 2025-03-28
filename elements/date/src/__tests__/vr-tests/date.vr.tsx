import { snapshot } from '@af/visual-regression';

import {
	DateWithBlueColor,
	DateWithDefaultColor,
	DateWithFormat,
	DateWithGreenColor,
	DateWithGreyColor,
	DateWithOnClick,
	DateWithPurpleColor,
} from './date.fixture';

snapshot(DateWithDefaultColor);

snapshot(DateWithDefaultColor, {
	description: 'Date with default color hovered',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
});

snapshot(DateWithOnClick);

snapshot(DateWithFormat);

snapshot(DateWithBlueColor);

snapshot(DateWithBlueColor, {
	description: 'Date with blue color hovered',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
});

snapshot(DateWithGreenColor);

snapshot(DateWithGreenColor, {
	description: 'Date with green color hovered',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
});

snapshot(DateWithPurpleColor);

snapshot(DateWithPurpleColor, {
	description: 'Date with purple color hovered',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
});

snapshot(DateWithGreyColor);

snapshot(DateWithGreyColor, {
	description: 'Date with grey color hovered',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
});
