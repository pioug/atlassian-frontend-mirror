import React, {
	type ReactElement,
	type ReactNode,
	Suspense,
	useCallback,
	useMemo,
	useState,
} from 'react';

import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import { StopPropagation } from '../../view/common/stop-propagation';
import { SmartLinkModalContext } from './index';
import { type SmartLinkModalAPI, type SmartLinkModalProviderProps } from './types';

export const SmartLinkModalProvider = ({
	children,
}: SmartLinkModalProviderProps): React.JSX.Element => {
	const [element, setElement] = useState<ReactNode | ReactElement>(null);

	const api: SmartLinkModalAPI = useMemo(
		() => ({
			open: (modal) =>
				setElement(
					<Suspense fallback={null}>
						<StopPropagation>{modal}</StopPropagation>
					</Suspense>,
				),
			close: () => setElement(null),
		}),
		[],
	);

	const fallbackRender = useCallback(
		({ resetErrorBoundary }: { resetErrorBoundary: FallbackProps['resetErrorBoundary'] }) => {
			resetErrorBoundary();
			return null;
		},
		[],
	);

	const onReset = useCallback(() => setElement(null), []);

	return (
		<>
			<SmartLinkModalContext.Provider value={api}>{children}</SmartLinkModalContext.Provider>
			<ErrorBoundary fallbackRender={fallbackRender} onReset={onReset}>
				{element}
			</ErrorBoundary>
		</>
	);
};
