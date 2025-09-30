import type { API, FileInfo, Options } from 'jscodeshift';

import {
	migrateRadioAriaLabelledby,
	migrateRadioGroupAriaLabelledby,
} from './migrations/migrate-aria-labelledby';
import { createTransformer } from './utils';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer('@atlaskit/radio', [
		migrateRadioAriaLabelledby,
		migrateRadioGroupAriaLabelledby,
	]);

export default transformer;
