import { pickerType } from './analytics';
import type { UserPickerSession } from './analytics';
import { sessionId } from './sessionId';
import { type UserPickerProps } from './types';

export const createDefaultPickerAttributes: any = (
	props: UserPickerProps,
	session?: UserPickerSession,
	journeyId?: string,
) => ({
	context: props.fieldId,
	sessionId: sessionId(session),
	pickerType: pickerType(props),
	journeyId,
});
