import type { JsonLd } from 'json-ld-types';
import { ActionName } from '../../../constants';
import type { FlexibleUiActions } from '../../../state/flexible-ui-context/types';
import type { CardActionOptions } from '../../../view/Card/types';
import { extractPreviewAction } from './extract-preview-action';

const extractActions = (
  response: JsonLd.Response,
  actionOptions?: CardActionOptions,
): FlexibleUiActions | undefined => {
  const action = {
    [ActionName.PreviewAction]: extractPreviewAction(response, actionOptions),
  };

  return Object.values(action).some((value) => Boolean(value))
    ? action
    : undefined;
};

export default extractActions;
