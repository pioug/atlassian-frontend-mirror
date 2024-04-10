import type { JsonLd } from 'json-ld-types';
import { ActionName } from '../../../constants';
import type { FlexibleUiActions } from '../../../state/flexible-ui-context/types';
import type { CardActionOptions } from '../../../view/Card/types';
import { extractDownloadAction } from './extract-download-action';
import { extractPreviewAction } from './extract-preview-action';
import extractFollowAction from './extract-follow-action';

const extractActions = (
  response: JsonLd.Response,
  data: JsonLd.Data.BaseData,
  actionOptions?: CardActionOptions,
  id?: string,
): FlexibleUiActions | undefined => {
  const action = {
    [ActionName.DownloadAction]: extractDownloadAction(data, actionOptions),
    [ActionName.FollowAction]: extractFollowAction(response, actionOptions, id),
    [ActionName.PreviewAction]: extractPreviewAction(response, actionOptions),
  };

  return Object.values(action).some((value) => Boolean(value))
    ? action
    : undefined;
};

export default extractActions;
