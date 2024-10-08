import { type MessageDescriptor } from 'react-intl-next';

// fakeIntl["..."] here to indicate those went through formatMessage and not just left as string itself
export const fakeIntl: any = {
	formatMessage: jest.fn(
		({ defaultMessage }: MessageDescriptor) => `fakeIntl["${defaultMessage}"]`,
	),
};
