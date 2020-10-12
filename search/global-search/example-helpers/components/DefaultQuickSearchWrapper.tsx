import React from 'react';
import { GlobalQuickSearch, Props } from '../../src';
import { randomSpaceIconUrl } from '../mocks/mockData';
import { DEVELOPMENT_LOGGER } from './DevelopmentLogger';

export type PartialProps = Pick<
  Props,
  Exclude<keyof Props, 'confluenceUrl' | 'modelContext'>
>;

const defaultCloudId = '497ea592-beb4-43c3-9137-a6e5fa301088'; // jdog

class NoNavigationLinkComponent extends React.Component<any> {
  static hackToRemoveNonDomProps(props: any) {
    const SPECIAL_PROPS = ['key', 'children'];
    const anchor = document.createElement('a');

    const out: any = {};
    Object.keys(props)
      .filter(
        propName =>
          propName in anchor ||
          propName.toLowerCase() in anchor ||
          SPECIAL_PROPS.includes(propName),
      )
      .forEach(key => (out[key] = props[key]));

    return out;
  }

  onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    this.props.onClick();
    e.preventDefault();
    console.log('Navigating to', this.props.href);
  };

  render() {
    return (
      /* eslint-disable-next-line jsx-a11y/anchor-has-content */
      <a
        {...NoNavigationLinkComponent.hackToRemoveNonDomProps(this.props)}
        onClick={this.onClick}
      />
    );
  }
}

export class DefaultQuickSearchWrapper extends React.Component<PartialProps> {
  static defaultProps = {
    cloudId: defaultCloudId,
    referralContextIdentifiers: {
      currentContentId: '123',
      currentContainerId: '456',
      searchReferrerId: '123',
      currentContainerName: 'Test space',
      currentContainerIcon: randomSpaceIconUrl(),
    },
    logger: DEVELOPMENT_LOGGER,

    // FF defaults
    fasterSearchFFEnabled: true,
  };

  render() {
    return (
      <GlobalQuickSearch
        confluenceUrl={
          this.props.context === 'confluence'
            ? 'example-confluence.com/wiki'
            : undefined
        }
        modelContext={
          this.props.context === 'confluence' ? { spaceKey: 'TEST' } : {}
        }
        linkComponent={NoNavigationLinkComponent as any}
        onAdvancedSearch={e => e.preventDefault()}
        {...this.props}
      />
    );
  }
}
