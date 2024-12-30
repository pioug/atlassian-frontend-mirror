import type { ContextViewModel } from '../../types';
import type { UnresolvedViewCardProps } from '../unresolved-view/types';

export type UnauthorizedViewProps = UnresolvedViewCardProps & {
	context?: ContextViewModel;
	extensionKey?: string;
	isProductIntegrationSupported?: boolean;
	onAuthorize?: () => void;
};
