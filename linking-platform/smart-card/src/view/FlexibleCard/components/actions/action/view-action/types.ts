import { ActionProps } from '../types';

export type ViewActionProps = ActionProps & {
  /* The URL that the action will link to. */
  viewUrl?: string;
  /* Base link URL used for analytics. */
  url: string;
};
