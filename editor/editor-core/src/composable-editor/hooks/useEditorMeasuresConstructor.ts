/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useConstructor } from '@atlaskit/editor-common/hooks';
import { startMeasure } from '@atlaskit/editor-common/performance-measures';

import measurements from '../../utils/performance/measure-enum';

/**
 *
 * Hook to be used for running analytics on mounting the editor.
 * Should run once.
 */
export default function useEditorConstructor(): void {
	useConstructor(() => {
		startMeasure(measurements.EDITOR_MOUNTED);
	});
}
