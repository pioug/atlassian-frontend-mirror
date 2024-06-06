import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import PasswordInputExample from '../../../examples/10-vr-password-input';

const defaultOptions: SnapshotTestOptions<Hooks> = {
	hooks: {
		// @ts-ignore
		relay: true,
	},
	drawsOutsideBounds: true,
};

snapshot(PasswordInputExample, defaultOptions);
