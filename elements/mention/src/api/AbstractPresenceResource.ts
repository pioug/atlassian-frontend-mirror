import debug from '../util/logger';
import { AbstractResource } from './AbstractResource';
import type { PresenceMap, PresenceProvider } from './PresenceResource';

export class AbstractPresenceResource
	extends AbstractResource<PresenceMap>
	implements PresenceProvider
{
	refreshPresence(userIds: string[]): void {
		throw new Error(`not yet implemented.\nParams: userIds=${userIds}`);
	}

	protected notifyListeners(presences: PresenceMap): void {
		this.changeListeners.forEach((listener, key) => {
			try {
				listener(presences);
			} catch (e) {
				// ignore error from listener
				debug(`error from listener '${key}', ignoring`, e);
			}
		});
	}
}
