import { type JQLFieldResponse } from '../../common/types';

const CF_ID_PATTERN = /^"?cf\[\d+]"?$/;

const COLLAPSED_FIELD_PATTERN = /^"?.+\[(.+)]"?$/;

const isCollapsedField = ({ value }: JQLFieldResponse) =>
	COLLAPSED_FIELD_PATTERN.test(value) && !CF_ID_PATTERN.test(value);

export const getFieldType = (field: JQLFieldResponse): string | null => {
	if (!isCollapsedField(field)) {
		return null;
	}

	const matches = COLLAPSED_FIELD_PATTERN.exec(field.value);

	if (!matches || matches.length < 2) {
		return null;
	}

	return matches[1];
};
