import type { OnToneSelected } from '../src/types';
import debug from '../src/util/logger';

export const onToneSelected: OnToneSelected = (variation: number) =>
	debug('tone selected', variation);
