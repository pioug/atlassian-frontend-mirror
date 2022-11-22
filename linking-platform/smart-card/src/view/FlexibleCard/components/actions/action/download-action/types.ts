import { ActionProps } from '../types';

export type DownloadActionProps = ActionProps & {
  /* The URL that the action will link to. */
  downloadUrl?: string;
  /* Base link URL used for analytics. */
  url: string;
};

export interface DownloadFunctionProps {
  url?: string;
}
