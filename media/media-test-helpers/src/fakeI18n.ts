import { type MessageDescriptor } from 'react-intl-next';
import getJest from './getJest';

const jestHelper = getJest();

// fakeIntl["..."] here to indicate those went through formatMessage and not just left as string itself
export const fakeIntl: any = {
	formatMessage: jestHelper.fn(
		({ defaultMessage }: MessageDescriptor) => `fakeIntl["${defaultMessage}"]`,
	),
};
