/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';

const styles = cssMap({
	block: {
		display: 'block',
		position: 'relative',
		height: 0,
		pointerEvents: 'none',
	},
	inline: {
		display: 'inline-block',
		position: 'absolute',
		width: 0,
		height: '1rem',
		pointerEvents: 'none',
	},
});

/**
 * Anchors the shared drop indicator without adding space to the document.
 * Keep its edge and terminal styling aligned with editor-plugin-block-controls/src/ui/drop-target.tsx.
 */
export const MediaDropIndicator = ({ inline }: { inline: boolean }): JSX.Element => (
	<span
		aria-hidden="true"
		data-testid="media-drop-indicator"
		css={[!inline && styles.block, inline && styles.inline]}
	>
		<DropIndicator edge={inline ? 'left' : 'top'} />
	</span>
);
