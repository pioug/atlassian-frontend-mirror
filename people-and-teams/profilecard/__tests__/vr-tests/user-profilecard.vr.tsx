import { snapshot } from '@af/visual-regression';

import {
	AlternateActions,
	BestCaseProfile,
	BotCaseProfile,
	ErrorState,
	ErrorStateNotFound,
	WorstCaseProfile,
} from '../../examples/03-profilecard-overview';

snapshot(ErrorState);
snapshot(ErrorStateNotFound);
snapshot(BestCaseProfile);
snapshot(WorstCaseProfile);
snapshot(BotCaseProfile);
snapshot(AlternateActions);
