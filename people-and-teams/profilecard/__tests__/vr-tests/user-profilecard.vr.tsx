import { snapshot } from '@af/visual-regression';

import {
	AlternateActions,
	AppUserProfile,
	BestCaseProfile,
	BotCaseProfile,
	ErrorState,
	ErrorStateNotFound,
	WorstCaseProfile,
} from '../../examples/03-profilecard-overview.vr.ap';

snapshot(ErrorState);
snapshot(ErrorStateNotFound);
snapshot(BestCaseProfile);
snapshot(WorstCaseProfile);
snapshot(BotCaseProfile);
snapshot(AppUserProfile);
snapshot(AlternateActions);
