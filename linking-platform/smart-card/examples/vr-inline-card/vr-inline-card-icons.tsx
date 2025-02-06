import { InlineCardIcons } from '../utils/inline-card-icons';
import { withWaitForItem } from '../utils/with-wait-for-item';

export default withWaitForItem(InlineCardIcons, () => {
	const item = document.body.querySelectorAll('[data-testid="document-file-format-icon"]');
	return item[20];
});
