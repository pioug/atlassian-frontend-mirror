import type {
	PresenceBulk,
	PresenceMap,
	PresenceParser,
	PresenceResponse,
} from './PresenceResource';

export class DefaultPresenceParser implements PresenceParser {
	static FOCUS_STATE = 'focus';

	mapState(state: string): string {
		if (state === 'unavailable') {
			return 'offline';
		} else if (state === 'available') {
			return 'online';
		} else {
			return state;
		}
	}

	parse(response: PresenceResponse): PresenceMap {
		const presences: PresenceMap = {};
		if (response.hasOwnProperty('data') && response['data'].hasOwnProperty('PresenceBulk')) {
			const results = response['data'].PresenceBulk;
			// Store map of state and time indexed by userId.  Ignore null results.
			for (const user of results) {
				if (user.userId && user.state) {
					const state = DefaultPresenceParser.extractState(user) || user.state;
					presences[user.userId] = {
						status: this.mapState(state),
					};
				} else if (!user.hasOwnProperty('userId') || !user.hasOwnProperty('state')) {
					// eslint-disable-next-line no-console
					console.error(
						'Unexpected response from presence service contains keys: ' + Object.keys(user),
					);
				}
			}
		}
		return presences;
	}

	private static extractState(presence: PresenceBulk): string | null {
		if (DefaultPresenceParser.isFocusState(presence)) {
			return DefaultPresenceParser.FOCUS_STATE;
		}
		return presence.state;
	}

	/*
    This is a bit of an odd exception. In the case where a user is in "Focus Mode", their presence state
    is returned as 'busy' along with a `stateMetadata` object containing a `focus` field.
    In this case we ignore the value of the `state` field and treat the presence as a 'focus' state.
   */
	private static isFocusState(presence: PresenceBulk): boolean {
		if (presence.stateMetadata) {
			try {
				const metadata = JSON.parse(presence.stateMetadata);
				return metadata && !!metadata.focus;
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(
					`Failed to parse presence's stateMetadata for user with id ${presence.userId}: ${presence.stateMetadata}`,
				);
				// eslint-disable-next-line no-console
				console.error(e);
			}
		}
		return false;
	}
}
