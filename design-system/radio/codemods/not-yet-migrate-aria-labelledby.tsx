import type { API, FileInfo, Options } from 'jscodeshift';

import { createTransformer } from './create-transformer';
import { migrateRadioAriaLabelledby } from './migrations/migrate-radio-aria-labelledby';
import { migrateRadioGroupAriaLabelledby } from './migrations/migrate-radio-group-aria-labelledby';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer('@atlaskit/radio', [
		migrateRadioAriaLabelledby,
		migrateRadioGroupAriaLabelledby,
	]);

export default transformer;
