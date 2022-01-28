import { JsonLd } from 'json-ld-types';
import { FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import { extractTitle } from '../common/primitives';

const extractFlexibleUiContext = (
  response?: JsonLd.Response,
): FlexibleUiDataContext | undefined => {
  if (!response) {
    return undefined;
  }

  const data = response.data as JsonLd.Data.BaseData;
  return {
    title: extractTitle(data),
  };
};

export default extractFlexibleUiContext;
