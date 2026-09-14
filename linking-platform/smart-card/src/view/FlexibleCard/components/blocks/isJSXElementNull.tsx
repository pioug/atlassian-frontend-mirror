export const isJSXElementNull = (children: JSX.Element): boolean => {
	return Boolean(children.type() === null);
};
