import { type FileItem, type FileDetails } from '@atlaskit/media-client';
import { type ReactNode } from 'react';

export interface CardAction {
  label?: string;
  handler: CardEventHandler;
  icon?: ReactNode;
}

export type CardEventHandler = (item?: FileItem, event?: Event) => void;

export function attachDetailsToActions(
  actions: Array<CardAction>,
  details: FileDetails,
): Array<CardAction> {
  return actions.map((action: CardAction) => ({
    ...action,
    handler: () => {
      action.handler({ type: 'file', details });
    },
  }));
}
