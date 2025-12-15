import { defineMessages } from 'react-intl-next';

export default defineMessages({
	removeFromFavouritesLabel: {
		id: 'rovo-chat.browse-agents.remove-from-favourites-label',
		defaultMessage: 'Remove from favourites',
		description: 'Button label/aria label for removing agent from favorites. Shown when agent is already favorited and button is clicked to unfavorite.',
	},
	clickToFavouriteLabel: {
		id: 'rovo-chat.browse-agents.click-to-favourite-label',
		defaultMessage: 'Not favourited, click to favourite',
		description: 'Button label/aria label indicating agent is not favorited. Instructions to click the star button to add agent to favorites.',
	},
});
