export const generateSpanId = () =>
	Array.from(new Array(16), () => Math.floor(Math.random() * 16).toString(16)).join('');
