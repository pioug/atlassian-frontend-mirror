import React, { createContext, useCallback, useContext, useState } from 'react';

import { Validator, ValidatorMap } from '../../common/types';

interface FormContextType {
  assignValidator: (name: string, validators: Validator[]) => void;
  getValidators: () => ValidatorMap;
}

export const FormContext = createContext<FormContextType>({
  assignValidator: () => {},
  getValidators: () => ({}),
});

const FormContextProvider: React.FC<{}> = ({ children }) => {
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

  return (
    <FormContext.Provider value={{ assignValidator, getValidators }}>
      {children}
    </FormContext.Provider>
  );
};

const useFormContext = () => useContext(FormContext);

export { FormContextProvider, useFormContext };
