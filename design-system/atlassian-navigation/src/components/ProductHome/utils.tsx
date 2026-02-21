export const getTag = (onClick?: (arg: any) => void, href?: string): 'button' | 'a' | 'div' => {
	if (href) {
		return 'a';
	}

	if (onClick) {
		return 'button';
	}

	return 'div';
};
