export const generateUniqueId = () => {
	return (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, '');
};
