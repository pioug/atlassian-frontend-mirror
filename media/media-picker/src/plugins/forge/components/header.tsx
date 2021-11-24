import React from 'react';
import FieldText from '@atlaskit/textfield';
import { PluginHeaderWrapper } from './styled';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';

export interface PluginHeaderProps {
  name: string;
  loading: boolean;
  error?: Error;
  totalImages?: number;
  onQueryChange: React.FormEventHandler<HTMLInputElement>;
  query?: string;
}
export const PluginHeader: React.FC<PluginHeaderProps> = injectIntl(
  ({
    name,
    loading,
    error,
    totalImages,
    onQueryChange,
    query,
    intl: { formatMessage },
  }: PluginHeaderProps & WrappedComponentProps) => {
    const isReady = !loading && !error;
    const hasImages = isReady && typeof totalImages === 'number';

    return (
      <PluginHeaderWrapper>
        <h3>{name}</h3>
        {!error && hasImages && (
          <FieldText
            placeholder={formatMessage(messages.search)}
            onChange={onQueryChange}
            value={query}
            width={420}
          />
        )}
      </PluginHeaderWrapper>
    );
  },
);
