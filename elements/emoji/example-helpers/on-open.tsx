import type { OnLifecycle } from '../src/components/typeahead/EmojiTypeAheadComponent';
import debug from '../src/util/logger';

export const onOpen: OnLifecycle = () => debug('picker opened');
