import type { JsonLd } from 'json-ld-types';
import { ActionName, InternalActionName } from '../../../constants';
import type { FlexibleUiActions } from '../../../state/flexible-ui-context/types';
import { AISummaryConfig } from '../../../state/hooks/use-ai-summary-config/types';
import type { CardActionOptions } from '../../../view/Card/types';
import { extractDownloadAction } from './extract-download-action';
import { extractPreviewAction } from './extract-preview-action';
import { extractAISummaryAction } from './extract-ai-summary-action';
import extractFollowAction from './extract-follow-action';
import { extractCopyLinkAction } from './extract-copy-link-action';

const extractActions = (
  response: JsonLd.Response,
  url?: string,
  actionOptions?: CardActionOptions,
  id?: string,
  aiSummaryConfig?: AISummaryConfig,
): FlexibleUiActions | undefined => {
  const data = response.data as JsonLd.Data.BaseData;

  const action = {
    [ActionName.CopyLinkAction]: extractCopyLinkAction(data, actionOptions),
    [ActionName.DownloadAction]: extractDownloadAction(data, actionOptions),
    [ActionName.FollowAction]: extractFollowAction(response, actionOptions, id),
    [ActionName.PreviewAction]: extractPreviewAction(response, actionOptions),

    [InternalActionName.AISummaryAction]: extractAISummaryAction(
      response,
      url,
      actionOptions,
      aiSummaryConfig,
    ),
  };

  return Object.values(action).some((value) => Boolean(value))
    ? action
    : undefined;
};

export default extractActions;
