import { JsonLd } from 'json-ld-types';
import { CardClient } from '@atlaskit/link-provider';

// Be aware, this is a copy of a function in link-provider/src/helpers
export const getStatus = ({ meta }: JsonLd.Response): string => {
  const { access, visibility } = meta;
  switch (access) {
    case 'forbidden':
      if (visibility === 'not_found') {
        return 'not_found';
      } else {
        return 'forbidden';
      }
    case 'unauthorized':
      return 'unauthorized';
    default:
      return 'resolved';
  }
};

export const getExtensionKey = (
  details?: JsonLd.Response,
): string | undefined => details?.meta?.key;

export const resolveAttributes = async (url: string, client: CardClient) => {
  try {
    const response = await client.fetchData(url);
    return {
      extensionKey: getExtensionKey(response),
      status: getStatus(response),
    };
  } catch {
    return {};
  }
};
