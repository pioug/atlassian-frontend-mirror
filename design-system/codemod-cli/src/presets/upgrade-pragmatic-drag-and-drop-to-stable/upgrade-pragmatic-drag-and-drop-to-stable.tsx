import { type API, type FileInfo } from 'jscodeshift';

import { updateAutoScroll } from './transformers/auto-scroll';
import { shiftCanMonitorArgType } from './transformers/element-adapter-types';
import { moveFromFileAdapterToExternalAdapter } from './transformers/external-adapter';
import { moveToReactDropIndicator } from './transformers/move-to-react-drop-indicator';
import { shiftToPointerOutsideOfPreview } from './transformers/pointer-outside-of-preview';
import { shiftToPreventUnhandled } from './transformers/prevent-unhandled';
import { updateSafeImports } from './transformers/update-safe-imports';

const transformers = [
	updateSafeImports,
	moveFromFileAdapterToExternalAdapter,
	moveToReactDropIndicator,
	updateAutoScroll,
	shiftToPointerOutsideOfPreview,
	shiftToPreventUnhandled,
	shiftCanMonitorArgType,
];

export default function transformer(file: FileInfo, api: API): string {
	let source = file.source;
	for (const fn of transformers) {
		const updated: FileInfo = { ...file, source };
		source = fn(updated, api);
	}
	return source;
}
