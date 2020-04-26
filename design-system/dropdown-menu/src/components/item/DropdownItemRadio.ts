import RadioIcon from '@atlaskit/icon/glyph/radio';
import Item, { withItemFocus } from '@atlaskit/item';

import supportsVoiceover from '../../util/supportsVoiceover';
import withToggleInteraction from '../hoc/withToggleInteraction';

export default withToggleInteraction(withItemFocus(Item), RadioIcon, () =>
  supportsVoiceover() ? 'radio' : 'menuitemradio',
);
