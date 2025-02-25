import { type ContainerTypes } from '../common/types';
export { type UnlinkContainerMutationError } from './agg-client/utils/mutations/unlink-container-mutation';

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

export type TeamContainers = Array<{
	id: string;
	type: ContainerTypes;
	name: string;
	icon: string;
	createdDate: Date;
	link: string;
}>;
