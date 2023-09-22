/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { ErrorMessage } from '@atlaskit/editor-common/ui';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import EditorUnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
// Common Translations will live here
import type { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { PanelTextInput } from '@atlaskit/editor-common/ui';
import {
  FloatingToolbarButton as Button,
  FloatingToolbarSeparator as Separator,
} from '@atlaskit/editor-common/ui';

import type {
  ChildProps,
  RecentSearchInputTypes,
  RecentSearchSubmitOptions,
} from '@atlaskit/editor-common/link';
import {
  container,
  containerWithProvider,
  inputWrapper,
  RecentSearch,
} from '@atlaskit/editor-common/link';
import { linkToolbarMessages } from '@atlaskit/editor-common/messages';

import { normalizeUrl } from '@atlaskit/editor-common/utils';
import { R400 } from '@atlaskit/theme/colors';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { mediaLinkToolbarMessages } from './media-linking-toolbar-messages';
import { token } from '@atlaskit/tokens';

export type Props = {
  intl: IntlShape;
  providerFactory: ProviderFactory;
  editing: boolean;
  onBack: (url: string, meta: { inputMethod?: RecentSearchInputTypes }) => void;
  onUnlink: () => void;
  onCancel: () => void;
  onBlur: (href: string) => void;
  onSubmit: (
    href: string,
    meta: { inputMethod: RecentSearchInputTypes },
  ) => void;
  displayUrl?: string;
};

const validationWrapper = css`
  line-height: 0;
  padding: ${token('space.150', '12px')} ${token('space.300', '24px')}
    ${token('space.150', '12px')} 0;
  margin: 0 ${token('space.050', '4px')} 0 ${token('space.400', '32px')};
  border-top: 1px solid ${token('color.border.danger', R400)};
  align-items: start;
  display: flex;
  flex-direction: column;
`;

const buttonWrapper = css`
  padding: ${token('space.050', '4px')} ${token('space.100', '8px')}
    ${token('space.050', '4px')} 0px;
`;

export class LinkAddToolbar extends React.PureComponent<
  Props & WrappedComponentProps
> {
  state = {
    validationErrors: [],
  };

  private handleSubmit = ({ url, inputMethod }: RecentSearchSubmitOptions) => {
    this.props.onSubmit(url, { inputMethod });
  };

  private handleOnBack = ({
    url,
    inputMethod,
  }: {
    url: string;
    inputMethod?: RecentSearchInputTypes;
  }) => {
    const { onBack } = this.props;
    if (onBack) {
      onBack(url, { inputMethod });
    }
  };

  private handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  private handleUnlink = () => {
    const { onUnlink } = this.props;
    if (onUnlink) {
      onUnlink();
    }
  };

  private handleOnBlur = (options: RecentSearchSubmitOptions) => {
    this.props.onBlur(options.url);
  };

  private getValidationErrors(
    value: string,
    inputMethod?: INPUT_METHOD,
  ): string[] {
    const {
      intl: { formatMessage },
    } = this.props;

    // dont show validation errors if input method is typeahed, which means user selects from search list
    if (inputMethod === INPUT_METHOD.TYPEAHEAD) {
      return [];
    }
    if (!value) {
      return [formatMessage(linkToolbarMessages.emptyLink)];
    }
    // if url can be normalized - we consider it is a valid url
    // also don't show validaition errors for empty values
    if (normalizeUrl(value)) {
      return [];
    } else {
      return [formatMessage(linkToolbarMessages.invalidLink)];
    }
  }

  private renderContainer = ({
    activityProvider,
    inputProps: { onChange, onKeyDown, onSubmit, value },
    currentInputMethod,
    renderRecentList,
  }: ChildProps) => {
    const {
      intl: { formatMessage },
      displayUrl,
    } = this.props;
    const getPlaceholder = (hasActivityProvider: boolean) =>
      formatMessage(
        hasActivityProvider
          ? linkToolbarMessages.placeholder
          : linkToolbarMessages.linkPlaceholder,
      );

    const formatLinkAddressText = formatMessage(
      mediaLinkToolbarMessages.backLink,
    );
    const formatUnlinkText = formatMessage(linkToolbarMessages.unlink);

    const errorsList = this.state.validationErrors.map(function (error, index) {
      return <ErrorMessage key={index}>{error}</ErrorMessage>;
    });

    return (
      <div className="recent-list">
        <div css={[container, !!activityProvider && containerWithProvider]}>
          <div css={inputWrapper}>
            <span css={buttonWrapper}>
              <Button
                title={formatLinkAddressText}
                icon={<ChevronLeftLargeIcon label={formatLinkAddressText} />}
                onClick={() =>
                  this.handleOnBack({
                    url: value,
                    inputMethod: currentInputMethod,
                  })
                }
              />
            </span>
            <PanelTextInput
              testId="media-link-input"
              placeholder={getPlaceholder(!!activityProvider)}
              autoFocus={true}
              onCancel={this.handleCancel}
              defaultValue={value}
              onSubmit={(inputValue) => {
                const validationErrors = this.getValidationErrors(
                  inputValue,
                  currentInputMethod,
                );
                this.setState({ validationErrors });
                if (!validationErrors.length) {
                  onSubmit();
                }
              }}
              onChange={(value) => {
                this.setState({ validationErrors: [] });
                onChange(value);
              }}
              onKeyDown={onKeyDown}
            />
            {normalizeUrl(displayUrl) && (
              <Fragment>
                <Separator />
                <Button
                  title={formatUnlinkText}
                  icon={<EditorUnlinkIcon label={formatUnlinkText} />}
                  onClick={this.handleUnlink}
                />
              </Fragment>
            )}
          </div>
          {!!errorsList.length && (
            <section css={validationWrapper}>{errorsList}</section>
          )}
          {renderRecentList()}
        </div>
      </div>
    );
  };

  render() {
    const { providerFactory, displayUrl } = this.props;

    return (
      <RecentSearch
        defaultUrl={normalizeUrl(displayUrl)}
        providerFactory={providerFactory}
        onSubmit={this.handleSubmit}
        onBlur={this.handleOnBlur}
        render={this.renderContainer}
      />
    );
  }
}

export default LinkAddToolbar;
