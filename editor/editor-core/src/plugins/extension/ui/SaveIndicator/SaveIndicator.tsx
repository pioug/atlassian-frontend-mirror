/** @jsx jsx */
import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { css, jsx } from '@emotion/react';
import { G300, N0 } from '@atlaskit/theme/colors';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { FormattedMessage } from 'react-intl-next';
import { SaveIndicatorProps } from './types';
import { messages } from './messages';
import { token } from '@atlaskit/tokens';

const noop = () => {};

const saveIndicatorWrapper = css`
  display: flex;
  justify-content: center;
`;

const saveIndicatorContent = css`
  position: fixed;
  width: 256px;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 12px;

  background: ${token('elevation.surface.overlay', N0)};

  /* E300 */
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0px 8px 12px rgba(9, 30, 66, 0.15), 0px 0px 1px rgba(9, 30, 66, 0.31)`,
  )};
  border-radius: 16px;
`;

const saveIndicatorText = css`
  padding-left: 6px;
`;

export const SaveIndicator: FunctionComponent<SaveIndicatorProps> = ({
  children,
  duration,
  visible = true,
}) => {
  const [saving, setSaving] = useState(false);
  const shown = useRef(false);

  const onSaveStarted = useCallback(() => {
    if (!shown.current) {
      setSaving(true);
      shown.current = true;
    }
  }, []);

  useEffect(() => {
    if (saving) {
      const handleId = setTimeout(() => {
        setSaving(false);
      }, duration);

      return () => clearTimeout(handleId);
    }
  }, [saving, duration]);

  return (
    <Fragment>
      <div>{children({ onSaveStarted, onSaveEnded: noop })}</div>
      {visible && saving && (
        <div css={saveIndicatorWrapper}>
          <div css={saveIndicatorContent} data-testid="save-indicator-content">
            <CheckCircleIcon
              label="Saving"
              primaryColor={token('color.icon.success', G300)}
              size="small"
            />
            <span css={saveIndicatorText}>
              <FormattedMessage {...messages.saveIndicator} />
            </span>
          </div>
        </div>
      )}
    </Fragment>
  );
};
