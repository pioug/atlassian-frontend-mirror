/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Fragment as F } from 'react';
import {
  ModalHeaderProps as HeaderComponentProps,
  useModal,
} from '@atlaskit/modal-dialog';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import Button from '@atlaskit/button/custom-theme-button';
import { N100, N30A } from '@atlaskit/theme/colors';
import { FormattedMessage } from 'react-intl';
import { gs } from '../utils';
import { Icon, IconProps } from './Icon';
import { MetadataList, MetadataListProps } from './MetadataList';
import { Byline } from './Byline';
import { messages } from '../../messages';

export interface HeaderProps extends HeaderComponentProps {
  title?: string;
  label: string;
  metadata?: MetadataListProps;
  icon?: IconProps;
  providerName?: string;
  url?: string;
  download?: string;
  byline?: React.ReactNode;
  onViewActionClick?: () => void;
  onDownloadActionClick?: () => void;
}
export const Header = ({
  title,
  label,
  metadata = { items: [] },
  icon,
  providerName,
  url,
  download,
  byline,
  onViewActionClick,
  onDownloadActionClick,
}: HeaderProps) => {
  const { onClose } = useModal();
  return (
    <div
      style={{
        paddingLeft: gs(3),
        paddingRight: gs(3),
        paddingBottom: gs(2),
        paddingTop: gs(2),
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderBottom: `1px solid ${N30A}`,
        }}
      >
        <div css={{ flex: 1 }}>
          <div css={{ display: 'flex' }}>
            {icon && <Icon {...icon} />}
            <div css={{ paddingLeft: gs(2), paddingBottom: gs(2) }}>
              <h3>{title}</h3>
              <div css={{ color: N100 }}>
                {(metadata.items.length && (
                  <MetadataList items={metadata.items} />
                )) || <Byline>{byline}</Byline>}
              </div>
            </div>
          </div>
        </div>
        <div>
          {download && (
            <Button
              appearance="primary"
              href={download}
              onClick={onDownloadActionClick}
            >
              <FormattedMessage {...messages.download} />
            </Button>
          )}
          {url && (
            <Button
              href={url}
              target="_blank"
              appearance="link"
              testId="preview-view-action"
              iconAfter={<ShortcutIcon size="small" label="go to source" />}
              onClick={onViewActionClick}
            >
              {providerName ? (
                <F>
                  <FormattedMessage {...messages.viewIn} /> {providerName}
                </F>
              ) : (
                <FormattedMessage {...messages.viewOriginal} />
              )}
            </Button>
          )}
          <Button
            appearance="subtle"
            iconBefore={<EditorCloseIcon label={label} />}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};
