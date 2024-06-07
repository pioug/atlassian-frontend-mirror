import type { RequestAccessContextProps } from '../../../types';
import type { ContextViewModel } from '../../types';
import type { UnresolvedViewCardProps } from '../unresolved-view/types';

export type ForbiddenViewProps = UnresolvedViewCardProps & {
	context?: ContextViewModel;
	onAuthorize?: () => void;
	accessContext: RequestAccessContextProps;
};
