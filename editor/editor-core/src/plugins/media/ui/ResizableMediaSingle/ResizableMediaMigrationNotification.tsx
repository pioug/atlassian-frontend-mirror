/** @jsx jsx */
import { jsx } from '@emotion/react';
import { resizableMediaMigrationNotificationStyle } from './styles';

export const ResizableMediaMigrationNotification = () => {
  return (
    <div
      data-testid="resizable-media-migration-notification"
      css={[resizableMediaMigrationNotificationStyle]}
    />
  );
};
