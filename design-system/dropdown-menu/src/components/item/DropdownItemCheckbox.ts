import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import Item, { withItemFocus } from '@atlaskit/item';

import supportsVoiceover from '../../util/supportsVoiceover';
import withToggleInteraction from '../hoc/withToggleInteraction';

export default withToggleInteraction(withItemFocus(Item), CheckboxIcon, () =>
  supportsVoiceover() ? 'checkbox' : 'menuitemcheckbox',
);
