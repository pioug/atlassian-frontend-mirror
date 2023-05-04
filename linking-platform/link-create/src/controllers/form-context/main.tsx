import React, { createContext, useCallback, useContext, useState } from 'react';

import { Validator, ValidatorMap } from '../../common/types';

interface FormContextType {
  assignValidator: (name: string, validators: Validator[]) => void;
  getValidators: () => ValidatorMap;
  setFormErrorMessage: (errorMessage?: string) => void;
  formErrorMessage?: string;
}

export const FormContext = createContext<FormContextType>({
  assignValidator: () => {},
  getValidators: () => ({}),
  setFormErrorMessage: () => {},
});

const FormContextProvider: React.FC<{}> = ({ children }) => {
  const [error, setError] = useState<string | undefined>();
  const [validators, setValidators] = useState<Record<string, Validator[]>>({});

  // Use useCallback to prevent infinite useEffect calls
  const assignValidator = useCallback(
    (name: string, fieldValidators: Validator[]) => {
      setValidators(prevValidators => ({
        ...prevValidators,
        [name]: fieldValidators,
      }));
    },
    [],
  );

  // Use useCallback to prevent infinite useEffect calls
  const getValidators = useCallback(() => {
    return validators;
  }, [validators]);

  // Callback to reset error state
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
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

const useFormContext = () => useContext(FormContext);

export { FormContextProvider, useFormContext };
