import { InlineCardLazyIcons } from '../utils/inline-card-lazy-icons';
import { withWaitForItem } from '../utils/with-wait-for-item';

export default withWaitForItem(InlineCardLazyIcons, () => {
	const item = document.body.querySelectorAll('[data-testid="document-file-format-icon"]');
	return item[20];
});
