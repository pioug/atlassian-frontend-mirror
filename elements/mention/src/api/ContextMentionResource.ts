import {
  MentionProvider,
  MentionContextIdentifier,
  // @ts-ignore
  ErrorCallback,
  // @ts-ignore
  InfoCallback,
  // @ts-ignore
  ResultCallback,
} from './MentionResource';
import { padArray } from '../util';
import { MentionDescription } from '../types';
export { MentionDescription };

export type MentionProviderFunctions = {
  [Key in keyof MentionProvider]: MentionProvider[Key] extends Function
    ? MentionProvider[Key]
    : never;
};

/**
 * This component is stateful and should be instantianted per contextIdentifiers.
 */
export default class ContextMentionResource implements MentionProvider {
  private mentionProvider: MentionProvider;
  private contextIdentifier: MentionContextIdentifier;

  constructor(
    mentionProvider: MentionProvider,
    contextIdentifier: MentionContextIdentifier,
  ) {
    this.mentionProvider = mentionProvider;
    this.contextIdentifier = contextIdentifier;
  }

  getContextIdentifier(): MentionContextIdentifier | undefined {
    return this.contextIdentifier;
  }

  callWithContextIds = <K extends keyof MentionProviderFunctions>(
    f: K,
    declaredArgs: number,
  ): MentionProvider[K] => (...args: any[]) => {
    const argsLength = args ? args.length : 0;
    // cover the scenario where optional parameters are not passed
    // by passing undefined instead to keep the contextIdentifiers parameter in the right position
    const mentionArgs =
      argsLength !== declaredArgs
        ? padArray(args, declaredArgs - argsLength, undefined)
        : args;
    return (this.mentionProvider[f] as Function)(
      ...mentionArgs,
      this.contextIdentifier,
    );
  };

  callDefault = <K extends keyof MentionProviderFunctions>(
    f: K,
  ): MentionProvider[K] => (...args: any[]) =>
    (this.mentionProvider[f] as Function)(...args);

  subscribe = this.callDefault('subscribe');

  unsubscribe = this.callDefault('unsubscribe');

  filter = this.callWithContextIds('filter', 1);

  recordMentionSelection = this.callWithContextIds('recordMentionSelection', 1);

  shouldHighlightMention = this.callDefault('shouldHighlightMention');

  isFiltering = this.callDefault('isFiltering');
}
