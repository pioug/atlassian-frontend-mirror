import React from 'react';
import { ForgeViewType } from '../types';
import { SelectedItem } from '../../../popup/domain';
import { BricksView, BrickItem } from '../../views/bricks';
import { BrowserView } from '../../views/browser/browser';
import { JsonLd } from 'json-ld-types';
import { getResourceUrl } from '../../../plugins/extractors';

export interface ForgeViewMapperProps {
  view: ForgeViewType;
  items: JsonLd.Collection;
  iconUrl: string;
  selectedItems: SelectedItem[];
  onUpdateItems: () => void;
  onFileClick: (id: string) => void;
  onFolderClick: (id: string) => void;
  name: string;
}
export const ForgeViewMapper = ({
  view,
  items,
  iconUrl,
  onUpdateItems,
  selectedItems,
  onFileClick,
  name,
}: ForgeViewMapperProps) => {
  const viewProps = {
    selectedItems,
    onFileClick,
    onFolderClick: onFileClick,
    pluginName: name,
  };
  if (view === 'bricks') {
    if (!items.data) {
      return null;
    }

    const brickItems: BrickItem[] = items.data.items.map((item) => {
      const url = getResourceUrl(item.url) || '';
      const src =
        (item.image &&
          typeof item.image !== 'string' &&
          item.image['@type'] === 'Link' &&
          item.image.href) ||
        '';
      const width =
        (item.image &&
          typeof item.image !== 'string' &&
          item.image['@type'] === 'Link' &&
          item.image.width) ||
        0;
      const height =
        (item.image &&
          typeof item.image !== 'string' &&
          item.image['@type'] === 'Link' &&
          item.image.height) ||
        0;

      return {
        id: url,
        dimensions: { width, height },
        dataURI: src,
        name,
      };
    });

    return <BricksView items={brickItems} {...viewProps} />;
  } else if (view === 'folder') {
    return (
      <BrowserView
        items={items}
        iconUrl={iconUrl}
        onAuthSucceeded={onUpdateItems}
        onAuthFailed={(err: Error) =>
          // eslint-disable-next-line no-console
          console.error(err)
        }
        {...viewProps}
      />
    );
  }

  return null;
};
