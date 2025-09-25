import { snapshot } from '@af/visual-regression';

import {
	AlternateActions,
	BestCaseProfile,
	BotCaseProfile,
	ErrorState,
	ErrorStateNotFound,
	WorstCaseProfile,
} from '../../examples/03-profilecard-overview';

snapshot(ErrorState, {
	hooks: {
		flags: {
			profilecard_primitives_compiled: true,
		},
	},
});
snapshot(ErrorStateNotFound, {
	hooks: {
		flags: {
			profilecard_primitives_compiled: true,
		},
	},
});
snapshot(BestCaseProfile, {
	hooks: {
		flags: {
			profilecard_primitives_compiled: true,
		},
	},
});
snapshot(WorstCaseProfile, {
	hooks: {
		flags: {
			profilecard_primitives_compiled: true,
		},
	},
});
snapshot(BotCaseProfile, {
	hooks: {
		flags: {
			profilecard_primitives_compiled: true,
		},
	},
});
snapshot(AlternateActions, {
	hooks: {
		flags: {
			profilecard_primitives_compiled: true,
		},
	},
});
