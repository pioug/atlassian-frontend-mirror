export { type UnlinkContainerMutationError } from './agg-client/utils/mutations/unlink-container-mutation';
import type { TeamContainer } from '../common/types';

export type ClientContext = {
	cloudId?: string | null;
	orgId?: string;
	userId?: string;
};

export type ClientContextProps = {
	cloudId?: string | null;
	orgId?: string;
	userId?: string;
};

export type TeamContainers = Array<TeamContainer>;
