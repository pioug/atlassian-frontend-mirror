import React, {
	type ReactElement,
	type ReactNode,
	Suspense,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { type SmartLinkModalAPI, type SmartLinkModalProviderProps } from './types';

const FALLBACK_API = { open: () => {}, close: () => {} };

export const SmartLinkModalContext = React.createContext<SmartLinkModalAPI>(FALLBACK_API);

export const SmartLinkModalProvider = ({ children }: SmartLinkModalProviderProps) => {
	const [element, setElement] = useState<ReactNode | ReactElement>(null);

	const api: SmartLinkModalAPI = useMemo(
		() => ({
			open: (modal) => setElement(<Suspense fallback={null}>{modal}</Suspense>),
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

/**
 * Open (lazy load) modal
 *
 * This hook injects the element below Card and standalone HoverCard component.
 * It is intended to solve the issue where modal triggered by the parent component
 * disappear when the parent component is unmounted.
 *
 * For example, clicking on hover card action to open a modal. Once the modal is opened,
 * hover card disappears.
 *
 * Usage:
 *   const modal = useSmartLinkModal()
 *   modal.open(<SomeLazyLoadModal isOpen={true} onClose={() => modal.close()} />);
 */
export const useSmartLinkModal = () => useContext(SmartLinkModalContext);
