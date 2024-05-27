import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { type CreatePayload } from '../../common/types';

type EditPostCreateModalContextValue = {
  /**
   * The created object that is current being editted in the post-create flow
   */
  editViewPayload?: CreatePayload | undefined;
  /**
   * Sets the object to be editted in the post-create edit flow
   */
  setEditViewPayload: (payload?: CreatePayload) => void;
  /**
   * Callback to tell link create to trigger post-create edit flow after
   * an object is created
   */
  enableEditView: (enable: boolean) => void;
  /**
   * Returns whether or not the edit view should be activated on next object creation
   */
  shouldActivateEditView: () => boolean;
};

const EditPostCreateModalContext =
  createContext<EditPostCreateModalContextValue>({
    editViewPayload: undefined,
    setEditViewPayload: () => {},
    enableEditView: () => {},
    shouldActivateEditView: () => false,
  });

type EditPostCreateModalProviderProps = {
  /**
   * The value of the top-level link create props that indicates control
   * of whether the experience should be currently active
   */
  active: boolean;
  children:
    | React.ReactNode
    | ((value: EditPostCreateModalContextValue) => React.ReactNode);
};

export const EditPostCreateModalProvider = ({
  active,
  children,
}: EditPostCreateModalProviderProps) => {
  const shouldActivateEditView = useRef<boolean>(false);

  const [editViewPayload, setEditViewPayload] = useState<
    CreatePayload | undefined
  >(undefined);

  const value = useMemo(
    () => ({
      editViewPayload,
      setEditViewPayload,
      enableEditView: (enable: boolean) => {
        shouldActivateEditView.current = enable;
      },
      shouldActivateEditView: () => shouldActivateEditView.current,
    }),
    [editViewPayload, setEditViewPayload],
  );

  if (editViewPayload && !active) {
    setEditViewPayload(undefined);
  }

  return (
    <EditPostCreateModalContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
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
