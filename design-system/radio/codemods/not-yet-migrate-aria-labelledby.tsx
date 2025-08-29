import {
	migrateRadioAriaLabelledby,
	migrateRadioGroupAriaLabelledby,
} from './migrations/migrate-aria-labelledby';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/radio', [
	migrateRadioAriaLabelledby,
	migrateRadioGroupAriaLabelledby,
]);

export default transformer;
