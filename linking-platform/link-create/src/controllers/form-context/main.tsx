import React, {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useState,
} from 'react';

import { type LinkCreateProps } from '../../common/types';

interface FormContextType {
	setFormErrorMessage: (errorMessage?: string) => void;
	formErrorMessage?: string;
	/**
	 * Callback that updates link create to tell it that it should/should not open the current plugins
	 * edit view after creation. Should be `undefined` if the plugin does not provide an edit view, or if `onComplete`
	 * is not defined as a prop at the `LinkCreate` props level
	 */
	enableEditView?: ((editButtonClicked: boolean) => void) | undefined;
}

export const FormContext = createContext<FormContextType>({
	setFormErrorMessage: () => {},
	enableEditView: undefined,
});

const FormContextProvider = ({
	enableEditView,
	children,
}: PropsWithChildren<{
	enableEditView?: (editButtonClicked: boolean) => void;
}>) => {
	const [error, setError] = useState<string | undefined>();

	// Sets the form footer error message
	const setFormErrorMessage = useCallback(
		(errorMessage?: string) => {
			return setError(errorMessage);
		},
		[setError],
	);

	return (
		<FormContext.Provider
			value={{
				setFormErrorMessage,
				formErrorMessage: error,
				enableEditView,
			}}
		>
			{children}
		</FormContext.Provider>
	);
};

const useFormContext = () => useContext(FormContext);

export { FormContextProvider, useFormContext };

export const withLinkCreateFormContext = <P extends LinkCreateProps>(
	WrappedComponent: React.ComponentType<P>,
) => {
	return (props: P) => (
		<FormContextProvider>
			<WrappedComponent {...props} />
		</FormContextProvider>
	);
};
