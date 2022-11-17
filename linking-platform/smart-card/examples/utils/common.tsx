/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';
import { JsonLd } from 'json-ld-types';
import Page from '@atlaskit/page';
import { iconGoogleDrive } from '../images';

interface VRTestCaseOpts {
  title: string;
  children: () => JSX.Element;
}

const subHeaderCSS = css`
  margin-top: 28px;
  margin-bottom: 8px;
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
