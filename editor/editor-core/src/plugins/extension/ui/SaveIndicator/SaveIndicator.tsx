import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { G300, N0 } from '@atlaskit/theme/colors';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { FormattedMessage } from 'react-intl';
import { SaveIndicatorProps } from './types';
import { messages } from './messages';

const noop = () => {};

const SaveIndicatorWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const SaveIndicatorContent = styled.div`
  position: fixed;
  width: 256px;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 12px;

  background: ${N0};

  /* E300 */
  box-shadow: 0px 8px 12px rgba(9, 30, 66, 0.15),
    0px 0px 1px rgba(9, 30, 66, 0.31);
  border-radius: 16px;
`;

const SaveIndicatorText = styled.span`
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
    <>
      <div>{children({ onSaveStarted, onSaveEnded: noop })}</div>
      {visible && saving && (
        <SaveIndicatorWrapper>
          <SaveIndicatorContent data-testid="save-indicator-content">
            <CheckCircleIcon label="Saving" primaryColor={G300} size="small" />
            <SaveIndicatorText>
              <FormattedMessage {...messages.saveIndicator} />
            </SaveIndicatorText>
          </SaveIndicatorContent>
        </SaveIndicatorWrapper>
      )}
    </>
  );
};
