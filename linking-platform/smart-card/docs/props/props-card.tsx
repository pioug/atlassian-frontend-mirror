import {
	type BaseCardProps,
	type OnClickData,
	type OnResolveCallback,
} from '../../src/view/Card/types';
import type { OnErrorCallback } from '../../src/view/types';

interface DocCardEventProps {
	fallbackComponent?: React.ComponentType;
	onClick: (event: React.MouseEvent | React.KeyboardEvent, data?: OnClickData) => void;
	onError?: OnErrorCallback;
	onResolve?: OnResolveCallback;
}

export default (props: BaseCardProps & DocCardEventProps) => null;
