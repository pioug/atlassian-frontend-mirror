import type { UnlinkContainerMutationError } from '@atlaskit/teams-client/unlink-container-mutation';

import type { TeamState } from './team-state';

export type State = {
	teams: Record<string, TeamState>;
	unlinkError: UnlinkContainerMutationError | null;
};
