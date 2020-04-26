import { ActionProps } from '../components/Action';

export interface ViewFunctionArg {
  url?: string;
}

export async function viewFunction({ url }: ViewFunctionArg) {
  if (!url) {
    return;
  }

  window.open(url, '_blank', 'noopener=yes');
}

export const ViewAction = ({ url }: { url?: string }): ActionProps => ({
  id: 'view-content',
  text: 'View',
  promise: () =>
    viewFunction({
      url,
    }),
});
