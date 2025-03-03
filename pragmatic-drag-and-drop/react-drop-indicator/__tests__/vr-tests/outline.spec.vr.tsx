import { snapshot } from '@af/visual-regression';

import {
	CustomBorderRadius,
	Inset,
	StrokeColorStandard,
	StrokeColorWarning,
} from '../../examples/outline';

const options: Parameters<typeof snapshot>[1] = {
	variants: [{ name: 'light', environment: { colorScheme: 'light' } }],
};

snapshot(StrokeColorStandard, options);
snapshot(StrokeColorWarning, options);
snapshot(CustomBorderRadius, options);
snapshot(Inset, options);
