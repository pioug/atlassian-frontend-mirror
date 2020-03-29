import RadioIcon from '@atlaskit/icon/glyph/radio';
import Item, { withItemFocus } from '@atlaskit/item';
import withToggleInteraction from '../hoc/withToggleInteraction';
import supportsVoiceover from '../../util/supportsVoiceover';

export default withToggleInteraction(withItemFocus(Item), RadioIcon, () =>
  supportsVoiceover() ? 'radio' : 'menuitemradio',
);
