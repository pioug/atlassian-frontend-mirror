import { MessageDescriptor } from 'react-intl-next';
import getJest from './getJest';

const jest = getJest();

// fakeIntl["..."] here to indicate those went through formatMessage and not just left as string itself
export const fakeIntl: any = {
  formatMessage: jest.fn(
    ({ defaultMessage }: MessageDescriptor) => `fakeIntl["${defaultMessage}"]`,
  ),
};
