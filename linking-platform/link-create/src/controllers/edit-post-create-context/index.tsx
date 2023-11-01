import React, { createContext, useContext, useMemo, useState } from 'react';

import { CreatePayload } from '../../common/types';

type EditPostCreateModalContextValue = {
  editViewPayload?: CreatePayload | undefined;
  setEditViewPayload: (payload?: CreatePayload) => void;
};

const EditPostCreateModalContext =
  createContext<EditPostCreateModalContextValue>({
    editViewPayload: undefined,
    setEditViewPayload: () => {},
  });

export const EditPostCreateModalProvider = ({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) => {
  const [editViewPayload, setEditViewPayload] = useState<
    CreatePayload | undefined
  >(undefined);

  const value = useMemo(
    () => ({ editViewPayload, setEditViewPayload }),
    [editViewPayload, setEditViewPayload],
  );

  if (editViewPayload && !active) {
    setEditViewPayload(undefined);
  }

  return (
    <EditPostCreateModalContext.Provider value={value}>
      {children}
    </EditPostCreateModalContext.Provider>
  );
};

export const useEditPostCreateModal = () => {
  const value = useContext(EditPostCreateModalContext);

  if (!value) {
    throw new Error(
      'useEditPostCreateModal used outside of useEditPostCreateModalProvider',
    );
  }

  return value;
};
