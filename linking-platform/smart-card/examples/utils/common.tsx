/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';
import { JsonLd } from 'json-ld-types';
import Page from '@atlaskit/page';
import { token } from '@atlaskit/tokens';
import { iconGoogleDrive } from '../images';
interface VRTestCaseOpts {
  title: string;
  children: () => JSX.Element;
}

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const subHeaderCSS = css`
  margin-top: 28px;
  margin-bottom: ${token('space.100', '8px')};
`;

export const VRTestCase = ({ title, children }: VRTestCaseOpts) => {
  return (
    <IntlProvider locale={'en'}>
      <Page>
        <div style={{ padding: '30px' }}>
          <h6 css={subHeaderCSS}>{title}</h6>
          {children()}
        </div>
      </Page>
    </IntlProvider>
  );
};

const content = `
<html>
  <body style="font-family:sans-serif;text-align:center;background-color:#091E4208">
    VR TEST: EMBED CONTENT
  </body>
</html>
`;
const encodedContent = encodeURIComponent(content);
export const overrideEmbedContent = `data:text/html;charset=utf-8,${encodedContent}`;

export const mocks = {
  notFound: {
    meta: {
      visibility: 'not_found',
      access: 'forbidden',
      auth: [],
      definitionId: 'd1',
      key: 'object-provider',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      generator: {
        '@type': 'Application',
        name: 'Google',
        icon: {
          '@type': 'Image',
          url: iconGoogleDrive,
        },
      },
      name: 'I love cheese',
      url: 'https://some.url',
    },
  } as JsonLd.Response,
  forbidden: {
    meta: {
      visibility: 'restricted',
      access: 'forbidden',
      auth: [
        {
          key: 'some-flow',
          displayName: 'Flow',
          url: 'https://outbound-auth/flow',
        },
      ],
      definitionId: 'd1',
      key: 'object-provider',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      generator: {
        '@type': 'Application',
        name: 'Google',
        icon: {
          '@type': 'Image',
          url: iconGoogleDrive,
        },
      },
      url: 'https://some.url',
    },
  } as JsonLd.Response,
  unauthorized: {
    meta: {
      access: 'unauthorized',
      visibility: 'restricted',
      auth: [
        {
          key: 'some-flow',
          displayName: 'Flow',
          url: 'https://outbound-auth/flow',
        },
      ],
      definitionId: 'd1',
      key: 'google-object-provider',
      resourceType: 'file',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      generator: {
        '@type': 'Application',
        name: 'Google',
        icon: {
          '@type': 'Image',
          url: iconGoogleDrive,
        },
      },
      url: 'https://some.url',
    },
  } as JsonLd.Response,
};

const toEmptyFunctionString = (): string => '() => {}';

export const toObjectString = (obj: object, indent: string = ''): string => {
  const str = Object.entries(obj)
    .map(([key, value]) => `${key}: ${toValueString(value)}`)
    .join(', ');
  return `${indent}{ ${str} }`;
};

const toArrayString = (arr: any[], indent: string = ''): string => {
  const str = arr
    .map((value: any) => toValueString(value, `${indent}\t`))
    .join(', ');
  return `[${str}${indent}]`;
};

const toValueString = (value: any, indent: string = ''): string => {
  if (typeof value === 'string') {
    return `"${value}"`;
  } else if (Array.isArray(value)) {
    return toArrayString(value, indent);
  } else if (typeof value === 'function') {
    return toEmptyFunctionString();
  } else if (typeof value === 'object') {
    if (value['$$typeof'] === Symbol.for('react.element')) {
      // This is likely the custom action icon
      return '<CustomComponent />';
    } else {
      return toObjectString(value, indent);
    }
  } else {
    return `${value}`;
  }
};

const toComponentProp = (key: string, value?: any, indent?: string): string => {
  if (typeof value === 'string') {
    return `${key}="${value}"`;
  } else {
    return `${key}={${toValueString(value, indent)}}`;
  }
};

export const toComponentProps = (
  props: object,
  indent: string = '\n\t',
): string =>
  Object.entries(props).reduce(
    (acc, [key, value]) =>
      `${acc}${indent}${toComponentProp(key, value, indent)}`,
    '',
  );
