const BASIC_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Modified copy of `uuid-validate` package
export const isValidUuid = (value: unknown): value is string => {
	if (typeof value !== 'string') {
		return false;
	}

	const normalizedValue = value.toLowerCase();

	if (!BASIC_UUID_REGEX.test(normalizedValue)) {
		return false;
	}

	const version = normalizedValue[14];
	if (version === '1' || version === '2') {
		return true;
	}

	if (version === '3' || version === '4' || version === '5') {
		const variant = normalizedValue[19];
		return variant === '8' || variant === '9' || variant === 'a' || variant === 'b';
	}

	return false;
};
