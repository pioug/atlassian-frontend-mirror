// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
	type MentionProvider,
	type MentionContextIdentifier,
	// @ts-ignore
	ErrorCallback,
	// @ts-ignore
	InfoCallback,
	// @ts-ignore
	ResultCallback,
} from './MentionResource';
import { padArray } from '../util';
import {
	type MentionDescription,
	type InviteFromMentionProvider,
	type XProductInviteMentionProvider,
	type AnalyticsCallback,
} from '../types';
export type { MentionDescription };

export type MentionProviderFunctions = Omit<
	{
		[Key in keyof MentionProvider]: MentionProvider[Key] extends Function
			? MentionProvider[Key]
			: never;
	},
	keyof InviteFromMentionProvider | keyof XProductInviteMentionProvider
>;

/**
 * This component is stateful and should be instantianted per contextIdentifiers.
 */
export default class ContextMentionResource implements MentionProvider {
	private mentionProvider: MentionProvider;
	private contextIdentifier: MentionContextIdentifier;

	constructor(mentionProvider: MentionProvider, contextIdentifier: MentionContextIdentifier) {
		this.mentionProvider = mentionProvider;
		this.contextIdentifier = contextIdentifier;
	}

	getContextIdentifier(): MentionContextIdentifier | undefined {
		return this.contextIdentifier;
	}

	callWithContextIds =
		<K extends keyof MentionProviderFunctions>(f: K, declaredArgs: number): MentionProvider[K] =>
		(...args: any[]) => {
			const argsLength = args ? args.length : 0;
			// cover the scenario where optional parameters are not passed
			// by passing undefined instead to keep the contextIdentifiers parameter in the right position
			const mentionArgs =
				argsLength !== declaredArgs ? padArray(args, declaredArgs - argsLength, undefined) : args;
			return (this.mentionProvider[f] as Function)(...mentionArgs, this.contextIdentifier);
		};

	callDefault =
		<K extends keyof MentionProviderFunctions>(f: K): MentionProvider[K] =>
		(...args: any[]) =>
			(this.mentionProvider[f] as Function)(...args);

	subscribe: (
		key: string,
		callback?: ResultCallback<MentionDescription[]> | undefined,
		errCallback?: ErrorCallback,
		infoCallback?: InfoCallback,
		allResultsCallback?: ResultCallback<MentionDescription[]> | undefined,
		analyticsCallback?: AnalyticsCallback,
	) => void = this.callDefault('subscribe');

	unsubscribe: (key: string) => void = this.callDefault('unsubscribe');

	filter: (query?: string, contextIdentifier?: MentionContextIdentifier) => void =
		this.callWithContextIds('filter', 1);

	recordMentionSelection: (
		mention: MentionDescription,
		contextIdentifier?: MentionContextIdentifier,
	) => void = this.callWithContextIds('recordMentionSelection', 1);

	shouldHighlightMention: (mention: MentionDescription) => boolean =
		this.callDefault('shouldHighlightMention');

	isFiltering: (query: string) => boolean = this.callDefault('isFiltering');
}
