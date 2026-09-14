import type { ResolvingMentionProvider } from './MentionResource';

export const isResolvingMentionProvider = (p: any): p is ResolvingMentionProvider =>
	!!(
		p &&
		(p as ResolvingMentionProvider).supportsMentionNameResolving &&
		p.supportsMentionNameResolving()
	);
