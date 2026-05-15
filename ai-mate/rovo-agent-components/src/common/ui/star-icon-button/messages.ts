import { defineMessages } from 'react-intl';

type MessageKeys = 'removeFromFavouritesLabel' | 'clickToFavouriteLabel';

const message: Record<MessageKeys, { id: string; defaultMessage: string; description?: string }> = defineMessages({
	removeFromFavouritesLabel: {
		id: 'rovo-chat.browse-agents.remove-from-favourites-label',
		defaultMessage: 'Remove {agentName} from favourites',
		description:
			'Button label/aria label for removing agent from favorites. Shown when agent is already favorited and button is clicked to unfavorite. The {agentName} placeholder is replaced with the agent name for unique accessible labels.',
	},
	clickToFavouriteLabel: {
		id: 'rovo-chat.browse-agents.click-to-favourite-label',
		defaultMessage: 'Add {agentName} to favourites',
		description:
			'Button label/aria label indicating agent is not favorited. Instructions to click the star button to add agent to favorites. The {agentName} placeholder is replaced with the agent name for unique accessible labels.',
	},
});

export default message;
