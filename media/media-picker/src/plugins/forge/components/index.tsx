import React from 'react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { ForgeViewProps, JsonLdCollectionEmpty } from '../types';
import { ForgeClient } from '../client';
import { ForgeViewMapper } from './mapper';
import { PluginHeader } from './header';
import {
  PluginWrapper,
  PluginContentContainer as PluginContentView,
} from './styled';
import { PluginLoadingView } from './loading';
import { PluginErrorView } from './error';
import { getMetadata } from '../utils';
import { JsonLd } from 'json-ld-types';

export const ForgeView = ({
  extensionOpts: { name, id, view, iconUrl },
  actions,
  selectedItems,
}: ForgeViewProps) => {
  const client = useMemo(() => new ForgeClient(), []);
  const [loading, setLoading] = useState<boolean>(true);
  const [contextId, setContextId] = useState<string>('');
  const [query, setQuery] = useState<string>();
  const [error, setError] = useState<Error>();
  const [items, setItems] = useState<JsonLd.Collection>(JsonLdCollectionEmpty);

  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onUpdateItems = useCallback(
    debounce(async (query: string, folderId?: string) => {
      try {
        setError(undefined);
        setLoading(true);
        const newItems = await client.invokeProvider(id, {
          query,
          folderId: folderId || contextId,
        });
        setItems(newItems);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 1000),
    [name, contextId],
  );
  const onQueryChange: React.FormEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setQuery(event.currentTarget.value);
      // @ts-ignore Introduced by unifying under the lodash package and its types in #3237
      onUpdateItems(query);
    },
    [onUpdateItems, query],
  );
  const onClick = useCallback(
    (id: string) => () => {
      const resource =
        items.data && [...items.data.items].find((item) => item.url === id);
      if (resource) {
        if (resource['@type'] === 'Collection') {
          const id = resource['@id'] || '';
          setContextId(id);
          // @ts-ignore Introduced by unifying under the lodash package and its types in #3237
          onUpdateItems(query, id);
        } else {
          const metadata = getMetadata(id, resource as JsonLd.Data.Document);
          actions.fileClick(metadata, name);
        }
      }
    },
    [items.data, onUpdateItems, query, actions, name],
  );
  const onFileClick = useCallback((id: string) => onClick(id)(), [onClick]);

  useEffect(() => {
    // @ts-ignore Introduced by unifying under the lodash package and its types in #3237
    onUpdateItems(query);
  }, [onUpdateItems, query, id]);

  return (
    <PluginWrapper>
      <PluginHeader
        name={name}
        loading={loading}
        error={error}
        totalImages={
          items.data && items.data.items && [...items.data.items].length
        }
        onQueryChange={onQueryChange}
        query={query}
      />
      {loading ? (
        <PluginLoadingView />
      ) : error ? (
        // @ts-ignore Introduced by unifying under the lodash package and its types in #3237
        <PluginErrorView error={error} onRetry={onUpdateItems} />
      ) : (
        <PluginContentView>
          <ForgeViewMapper
            view={view}
            items={items}
            iconUrl={iconUrl}
            selectedItems={selectedItems}
            // @ts-ignore Introduced by unifying under the lodash package and its types in #3237
            onUpdateItems={onUpdateItems}
            onFileClick={onFileClick}
            onFolderClick={onFileClick}
            name={name}
          />
        </PluginContentView>
      )}
    </PluginWrapper>
  );
};

export { ForgeIcon } from './icon';
