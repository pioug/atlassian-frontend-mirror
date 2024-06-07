import type { RequestAccessContextProps } from '../../../types';
import type { ContextViewModel } from '../../types';
import type { UnresolvedViewCardProps } from '../unresolved-view/types';

export type NotFoundViewProps = UnresolvedViewCardProps & {
	context?: ContextViewModel;
	accessContext?: RequestAccessContextProps;
};
