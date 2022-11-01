/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import AddItemIcon from '@atlaskit/icon/glyph/add-item';
import JiraCaptureIcon from '@atlaskit/icon/glyph/jira/capture';
import AddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import { B75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

const triggerStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  backgroundColor: B75,
});
const popupStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value `4`
  padding: token('spacing.scale.050', '4px'),
});
const HighlightPopup = (props: { children: React.ReactNode }) => (
  <Popup
    isOpen
    placement="bottom"
    content={() => (
      <div css={popupStyles}>
        <ButtonGroup>
          <Button iconBefore={<AddCommentIcon label="Add comment" />} />
          <Button iconBefore={<AddItemIcon label="Add item" />} />
          <Button iconBefore={<JiraCaptureIcon label="Capture in Jira" />} />
        </ButtonGroup>
      </div>
    )}
    trigger={(triggerProps) => (
      <span css={triggerStyles} {...triggerProps}>
        {props.children}
      </span>
    )}
  />
);

export default () => {
  return (
    <main>
      Thanks to soaring electricity costs and the potentially-enormous power
      drain of cooling equipment,{' '}
      <HighlightPopup>
        few people can happily leave aircon running 24/7
      </HighlightPopup>
      . This is especially true for those renters who must rely upon portable
      devices.
    </main>
  );
};
