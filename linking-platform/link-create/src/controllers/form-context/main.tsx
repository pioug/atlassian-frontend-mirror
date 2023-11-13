import React, { createContext, useCallback, useContext, useState } from 'react';

import { LinkCreateProps, Validator, ValidatorMap } from '../../common/types';

interface FormContextType {
  getValidators: () => ValidatorMap;
  assignValidator: (name: string, validators: Validator[]) => void;
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
  assignValidator: () => {},
  getValidators: () => ({}),
  setFormErrorMessage: () => {},
  enableEditView: undefined,
});

const FormContextProvider: React.FC<{
  enableEditView?: (editButtonClicked: boolean) => void;
}> = ({ enableEditView, children }) => {
  const [error, setError] = useState<string | undefined>();
  const [validators, setValidators] = useState<Record<string, Validator[]>>({});

  // Add validators to the form
  const assignValidator = useCallback(
    (name: string, fieldValidators: Validator[]) => {
      setValidators(prevValidators => ({
        ...prevValidators,
        [name]: fieldValidators,
      }));
    },
    [],
  );

  // Returns a validator function array
  const getValidators = useCallback(() => {
    return validators;
  }, [validators]);

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
        assignValidator,
        getValidators,
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
