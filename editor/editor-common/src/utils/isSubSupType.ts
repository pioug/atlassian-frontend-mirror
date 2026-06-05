export const isSubSupType = (type: string): type is 'sub' | 'sup' => {
	return type === 'sub' || type === 'sup';
};
