/** @jsx jsx */
import React, { useState } from 'react';

import { css, jsx } from '@emotion/core';
import { useUID } from 'react-uid';

import Button from '@atlaskit/button';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import WorldIcon from '@atlaskit/icon/glyph/world';
import { CompassIcon } from '@atlaskit/logo';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraSoftwareIcon } from '@atlaskit/logo/jira-software-icon';
import { smallDurationMs } from '@atlaskit/motion/durations';
import { B200, B400 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import {
  ExpandAction,
  ExpandedView,
  HeaderWrapper,
  ListWrapper,
  ScopesActionWrapper,
  ScopesItemsWrapper,
  TitleWrapper,
} from './styled';
import { PermissionProps, ProductPermissionProps, ScopeProps } from './types';

export const DescriptionList = ({
  descriptions,
}: {
  descriptions: React.ReactNode[];
}) => {
  const listItems = descriptions.map((description, index = 0) => (
    <li key={index++}> {description}</li>
  ));

  return <ListWrapper>{listItems}</ListWrapper>;
};

export const PermissionsGroup = ({
  icon,
  defaultIsExpanded = false,
  onClick,
  entities,
  action,
  descriptions,
  children,
}: {
  icon?: React.ReactChild;
  defaultIsExpanded?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>, isExpanded: boolean) => any;
  entities: React.ReactNode[];
  action: React.ReactNode;
  descriptions: React.ReactNode[];
  children?: React.ReactChild;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultIsExpanded);
  const uid = useUID();

  return (
    <ScopesActionWrapper>
      {action}
      <ScopesItemsWrapper>
        <Button
          testId="permission-button"
          aria-expanded={isExpanded}
          aria-controls={`permission-expander-${uid}`}
          appearance="subtle"
          iconBefore={icon}
          onClick={e => {
            setIsExpanded(!isExpanded);
            if (onClick) {
              onClick(e, !isExpanded);
            }
          }}
          iconAfter={
            <ExpandAction isExpanded={isExpanded}>
              <ChevronRightIcon label="" />
            </ExpandAction>
          }
        ></Button>
        {entities.join(', ')}
        <div
          data-testid="permission-details"
          aria-hidden={!isExpanded}
          id={`permission-expander-${uid}`}
        >
          {isExpanded ? (
            <ExpandedView>
              <DescriptionList descriptions={descriptions} />
            </ExpandedView>
          ) : null}
        </div>
      </ScopesItemsWrapper>
    </ScopesActionWrapper>
  );
};

export const ProductPermission = ({
  service,
  scopes,
}: ProductPermissionProps) => {
  const Icon = typeofIcon(service);
  return (
    <div>
      <HeaderWrapper>
        {
          <Icon
            label=""
            size="small"
            iconColor={B200}
            iconGradientStart={B400}
            iconGradientStop={B200}
          />
        }

        <TitleWrapper>
          In {convertFirstCharToUpperCase(service)}, it would like to:
        </TitleWrapper>
      </HeaderWrapper>

      {scopes.map((entry, index = 0) => {
        return (
          <PermissionsGroup
            entities={entry.entities}
            action={typeofAction(entry.action as string)}
            descriptions={entry.descriptions}
            key={index++}
          />
        );
      })}
    </div>
  );
};

export const AppPermissionsGroup = ({
  appPermissions,
}: {
  appPermissions: ProductPermissionProps[];
}) => {
  return (
    <div>
      {appPermissions.map((appPermission, index = 0) => {
        return (
          <ProductPermission
            service={appPermission.service}
            scopes={appPermission.scopes}
            key={index++}
          />
        );
      })}
    </div>
  );
};

export const Permission = ({
  title,
  icon,
  children,
  defaultIsExpanded = false,
  onClick,
}: PermissionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultIsExpanded);
  const uid = useUID();

  return (
    <div
      css={css`
        padding: ${gridSize()}px 0;
      `}
    >
      <Button
        testId="permission-button"
        aria-expanded={isExpanded}
        aria-controls={`permission-expander-${uid}`}
        appearance="subtle"
        shouldFitContainer
        iconBefore={icon}
        onClick={e => {
          setIsExpanded(!isExpanded);
          if (onClick) {
            onClick(e, !isExpanded);
          }
        }}
        iconAfter={
          <span
            css={css`
              transform: rotate(${isExpanded ? 90 : 0}deg);
              transition: transform ${smallDurationMs}ms;
            `}
          >
            <ChevronRightIcon label="" />
          </span>
        }
      >
        <div
          css={css`
            padding: 0 ${gridSize()}px;
            text-align: left;
          `}
        >
          {title}
        </div>
      </Button>
      <div
        data-testid="permission-details"
        aria-hidden={!isExpanded}
        id={`permission-expander-${uid}`}
      >
        {isExpanded ? (
          <div
            css={css`
              padding: ${gridSize()}px ${gridSize() * 6}px 0 ${gridSize() * 6}px;
              text-align: left;
            `}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const Scope = ({ id, children, ...others }: ScopeProps) => {
  const Icon = (() => {
    if (id.indexOf('confluence') !== -1) {
      return ConfluenceIcon;
    }
    if (id.indexOf('compass') !== -1) {
      return CompassIcon;
    }
    if (id.indexOf('jira-software') !== -1) {
      return JiraSoftwareIcon;
    }
    if (id.indexOf('jira') !== -1) {
      return JiraIcon;
    }
    return AtlassianIcon;
  })();

  return (
    <Permission
      icon={
        <Icon
          label=""
          size="small"
          iconColor={B200}
          iconGradientStart={B400}
          iconGradientStop={B200}
        />
      }
      {...others}
    >
      <p>{children}</p>
    </Permission>
  );
};

interface EgressProps {
  defaultIsExpanded?: boolean;
  addresses: string[];
  onClick?: (e: React.MouseEvent<HTMLElement>, isExpanded: boolean) => any;
}

export const addSubdomainMessage = (domains: string[]): string[] => {
  const wildcarded = domains.filter(domain => domain.startsWith('*'));
  const specific = new Set(domains.filter(domain => !domain.startsWith('*')));
  const domainList: string[] = [];

  wildcarded.forEach(domain => {
    if (specific.has(domain.substring(2))) {
      domainList.push(`${domain.substring(2)} and any of its subdomains`);
      specific.delete(domain.substring(2));
    } else if (domain !== '*') {
      domainList.push(`only subdomains of ${domain.substring(2)}`);
    }
  });

  domainList.push(...specific);
  return domainList;
};

export const getEgressPermissionTitle = (domains: string[]) => {
  return domains.includes('*')
    ? `Share data with unlimited locations outside of Atlassian.`
    : `Share data with ${domains.length} domain${
        domains.length === 1 ? '' : 's'
      } outside of Atlassian.`;
};

export const getEgressPermissionDescription = (domains: string[]) => {
  return domains.includes('*')
    ? 'The app may share personal data outside of Atlassian cloud to unlimited locations on the internet. This may be required for the app to fetch data from user-defined sources, though this can put your data privacy at risk.'
    : 'This allows the app to share personal data outside of Atlassian cloud via the following domains:';
};

export const Egress = ({ addresses, ...others }: EgressProps) => {
  const title = getEgressPermissionTitle(addresses);

  const domainList =
    addresses && addresses.length ? addSubdomainMessage(addresses) : [];

  return addresses.length > 0 ? (
    <Permission icon={<WorldIcon label="" />} title={title} {...others}>
      <p>{getEgressPermissionDescription(addresses)}</p>
      {!addresses.includes('*') ? (
        <ul>
          {domainList.map((egressDomain, index) => (
            <li key={index.toString()}>{egressDomain}</li>
          ))}
        </ul>
      ) : null}
    </Permission>
  ) : null;
};

export const typeofIcon = (id: string) => {
  if (id.indexOf('confluence') !== -1) {
    return ConfluenceIcon;
  }
  if (id.indexOf('compass') !== -1) {
    return CompassIcon;
  }
  if (id.indexOf('jira-software') !== -1) {
    return JiraSoftwareIcon;
  }
  if (id.indexOf('jira') !== -1) {
    return JiraIcon;
  }
  return AtlassianIcon;
};

export const typeofAction = (action: string) => {
  switch (action) {
    case 'read':
      return 'View';
    case 'write':
      return 'Update';
    case 'global':
      return 'Update';
    default:
      return convertFirstCharToUpperCase(action);
  }
};

const convertFirstCharToUpperCase = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export default { Egress, Permission, Scope, AppPermissionsGroup };
