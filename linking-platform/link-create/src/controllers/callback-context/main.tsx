import React, { useContext, useMemo } from 'react';

interface LinkCreateCallbackProviderProps {
  /**
   * This callback for when the resource has been successfully created.
   */
  onCreate?: (url: string) => void;

  /**
   * This callback for any errors
   */
  onFailure?: (error: unknown) => void;

  /**
   * This callback for when the form was manually discarded by user
   */
  onCancel?: () => void;
}

const LinkCreateCallbackContext =
  React.createContext<LinkCreateCallbackProviderProps>({});

const LinkCreateCallbackProvider: React.FC<LinkCreateCallbackProviderProps> = ({
  children,
  onCreate,
  onFailure,
  onCancel,
}) => {
  const value = useMemo(
    () => ({
      onCreate,
      onFailure,
      onCancel,
    }),
    [onCreate, onFailure, onCancel],
  );

  return (
    <LinkCreateCallbackContext.Provider value={value}>
      {children}
    </LinkCreateCallbackContext.Provider>
  );
};

const useLinkCreateCallback = () => useContext(LinkCreateCallbackContext);

export { LinkCreateCallbackProvider, useLinkCreateCallback };
