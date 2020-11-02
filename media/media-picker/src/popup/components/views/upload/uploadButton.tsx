import React from 'react';
import { connect, Dispatch } from 'react-redux';
import Button from '@atlaskit/button/custom-theme-button';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import { startFileBrowser } from '../../../actions/startFileBrowser';
import { State } from '../../../domain';
import { BrowserBase } from '../../../../components/browser/browser';

export interface LocalBrowserButtonProps {
  readonly browserRef: React.RefObject<BrowserBase>;
}

export interface LocalBrowserButtonDispatchProps {
  onClick: () => void;
}

export type Props = LocalBrowserButtonProps & LocalBrowserButtonDispatchProps;

export class LocalBrowserButton extends React.Component<Props> {
  private onUploadClick = (): void => {
    const { browserRef, onClick } = this.props;
    onClick();
    if (browserRef && browserRef.current) {
      browserRef.current.browse();
    }
  };

  render() {
    return (
      <Button
        testId="media-picker-upload-button"
        appearance="default"
        onClick={this.onUploadClick}
      >
        <FormattedMessage {...messages.upload_file} />
      </Button>
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<State>,
): LocalBrowserButtonDispatchProps => ({
  onClick: () => dispatch(startFileBrowser()),
});

export default connect<
  {},
  LocalBrowserButtonDispatchProps,
  LocalBrowserButtonProps
>(
  null,
  mapDispatchToProps,
)(LocalBrowserButton);
