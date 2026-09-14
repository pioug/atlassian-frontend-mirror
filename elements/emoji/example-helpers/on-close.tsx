import type { OnLifecycle } from '../src/components/typeahead/EmojiTypeAheadComponent';
import debug from '../src/util/logger';

export const onClose: OnLifecycle = () => debug('picker closed');
