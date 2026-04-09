export const stylePropComment = ({
	propName,
	prefix = '',
}: {
	propName: string;
	prefix?: string;
}) => {
	return `${prefix}This link could not be migrated due to custom styles in \`${propName}\` prop.`;
};
