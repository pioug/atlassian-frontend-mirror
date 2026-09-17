export const ProfilerMarker = ({ onRender }: { onRender?: () => void }) => {
	onRender?.();
	return null;
};
