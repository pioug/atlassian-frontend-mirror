import {
	type MentionDescription,
	type MentionProvider,
	type MentionsResult,
	type MentionStats,
} from '../types';
import debug from '../util/logger';
import { AbstractResource } from './AbstractResource';

const MAX_NOTIFIED_ITEMS = 20;

export class AbstractMentionResource
	extends AbstractResource<MentionDescription[]>
	implements MentionProvider
{
	shouldHighlightMention(_mention: MentionDescription): boolean {
		return false;
	}

	// eslint-disable-next-line class-methods-use-this
	filter(query?: string): void {
		throw new Error(`not yet implemented.\nParams: query=${query}`);
	}

	// eslint-disable-next-line class-methods-use-this, no-unused-vars
	recordMentionSelection(_mention: MentionDescription): void {
		// Do nothing
	}

	isFiltering(_query: string): boolean {
		return false;
	}

	protected _notifyListeners(mentionsResult: MentionsResult, stats?: MentionStats): void {
		debug(
			'ak-mention-resource._notifyListeners',
			mentionsResult && mentionsResult.mentions && mentionsResult.mentions.length,
			this.changeListeners,
		);

		this.changeListeners.forEach((listener, key) => {
			try {
				listener(mentionsResult.mentions.slice(0, MAX_NOTIFIED_ITEMS), mentionsResult.query, stats);
			} catch (e) {
				// ignore error from listener
				debug(`error from listener '${key}', ignoring`, e);
			}
		});
	}

	protected _notifyAllResultsListeners(mentionsResult: MentionsResult): void {
		debug(
			'ak-mention-resource._notifyAllResultsListeners',
			mentionsResult && mentionsResult.mentions && mentionsResult.mentions.length,
			this.changeListeners,
		);

		this.allResultsListeners.forEach((listener, key) => {
			try {
				listener(mentionsResult.mentions.slice(0, MAX_NOTIFIED_ITEMS), mentionsResult.query);
			} catch (e) {
				// ignore error from listener
				debug(`error from listener '${key}', ignoring`, e);
			}
		});
	}

	protected _notifyErrorListeners(error: Error, query?: string): void {
		this.errListeners.forEach((listener, key) => {
			try {
				listener(error, query);
			} catch (e) {
				// ignore error from listener
				debug(`error from listener '${key}', ignoring`, e);
			}
		});
	}

	protected _notifyInfoListeners(info: string): void {
		this.infoListeners.forEach((listener, key) => {
			try {
				listener(info);
			} catch (e) {
				// ignore error fromr listener
				debug(`error from listener '${key}', ignoring`, e);
			}
		});
	}

	protected _notifyAnalyticsListeners(
		event: string,
		actionSubject: string,
		action: string,
		attributes?: {
			[key: string]: any;
		},
	): void {
		this.analyticsListeners.forEach((listener, key) => {
			try {
				listener(event, actionSubject, action, attributes);
			} catch (e) {
				// ignore error from listener
				debug(`error from listener '${key}', ignoring`, e);
			}
		});
	}
}
