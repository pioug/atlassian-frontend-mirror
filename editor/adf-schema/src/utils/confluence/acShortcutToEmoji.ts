import { HC_EMOTICON_PREFIX } from './emoji';

export function acShortcutToEmoji(hipchatEmoticonShortName: string) {
	return {
		id: `${HC_EMOTICON_PREFIX}${hipchatEmoticonShortName}`,
		shortName: `:${hipchatEmoticonShortName}:`,
		text: '',
	};
}
