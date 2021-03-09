import React, { useContext } from 'react';
import { FileAttributes } from '@atlaskit/media-common';

const FileAttributesContext = React.createContext<FileAttributes | null>(null);

export type FileAttributesProviderProps = { data: FileAttributes };

export const FileAttributesProvider: React.FC<FileAttributesProviderProps> = ({
  children,
  data,
}) => {
  return data ? (
    <FileAttributesContext.Provider value={data}>
      {children}
    </FileAttributesContext.Provider>
  ) : (
    <>{children}</>
  );
};

export type WithFileAttributesProps = {
  fileAttributes?: FileAttributes;
};

export function withFileAttributes<Props>(
  Component: React.ComponentType<Props & WithFileAttributesProps>,
): React.FC<Props> {
  return (props: Props) => {
    const fileAttributes = useContext(FileAttributesContext);

    return fileAttributes ? (
      <Component {...props} fileAttributes={fileAttributes} />
    ) : (
      <Component {...props} />
    );
  };
}
