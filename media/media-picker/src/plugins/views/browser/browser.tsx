import React from 'react';
import { JsonLd } from 'json-ld-types';
import { BrowserAuthView } from './auth/auth';
import { ForgeViewBaseProps } from '../../forge';
import { SpinnerWrapper } from '../styled';
import { FolderViewer } from './folderView';

export type BrowserViewProps = ForgeViewBaseProps & {
  iconUrl: string;
  items: JsonLd.Collection;
  onFileClick(id: string): void;
  onFolderClick: (id: string) => void;
  onAuthSucceeded: () => void;
  onAuthFailed: (err: Error) => void;
};

const isUnauthorized = (meta: JsonLd.Meta.BaseMeta) =>
  meta.access === 'unauthorized' && meta.visibility === 'restricted';

export const BrowserView = ({
  items,
  iconUrl,
  pluginName: name,
  onAuthSucceeded,
  onAuthFailed,
  onFileClick,
  onFolderClick,
  selectedItems,
}: BrowserViewProps) => {
  if (!items) {
    return <SpinnerWrapper></SpinnerWrapper>;
  } else if (isUnauthorized(items.meta)) {
    return (
      <BrowserAuthView
        auth={items.meta.auth || []}
        iconUrl={iconUrl}
        name={name}
        onAuthSucceeded={onAuthSucceeded}
        onAuthFailed={onAuthFailed}
      />
    );
  } else {
    return (
      <FolderViewer
        selectedItems={selectedItems}
        items={items}
        onFolderClick={onFolderClick}
        onFileClick={onFileClick}
      />
    );
  }
};
