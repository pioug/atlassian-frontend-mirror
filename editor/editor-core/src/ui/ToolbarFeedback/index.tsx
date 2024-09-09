export default function ToolbarFeedback() {
	if (process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line no-console
		console.warn('ToolbarFeedback component is no longer available. This will be deprecated soon.');
	}
	return null;
}
