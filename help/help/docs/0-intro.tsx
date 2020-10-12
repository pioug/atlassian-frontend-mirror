import React from 'react';
import {
  md,
  code,
  Props,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';

const helpProps = require('!!extract-react-types-loader!../src/components/Help');

export default md`
  ${(
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <DevPreviewWarning />
      </div>
    </>
  )}

  ## Usage

  ${code`
import React from 'react';
import algoliasearch from 'algoliasearch';
import Page from '@atlaskit/page';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import Help from '../src';

import {
  ExampleWrapper,
  HelpWrapper,
  FooterContent,
  ExampleDefaultContent,
} from './utils/styled';

var client = algoliasearch('8K6J5OJIQW', 'c982b4b1a6ca921131d35edb63359b8c');
var index = client.initIndex('product_help_prod');

const Example: React.FC = () => {
  const onGetArticle = async (articleId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      index.search(
        {
          filters: "objectID:articleId",
        },
        (err, res) => {
          if (err) {
            reject(err);
          }

          if (res) {
            const article = res.hits[0];

            if (article) {
              resolve(article);
            } else {
              reject("not found");
            }
          } else {
            reject("No internet connection");
          }
        },
      );
    });
  };

  return (
    <ExampleWrapper>
      <Page>
        <HelpWrapper>
          <LocaleIntlProvider locale={'en'}>
            <Help
              articleId="zqjkEZh4DPqRCpUSeg8a5"
              onGetArticle={onGetArticle}
              footer={
                <FooterContent>
                  <span>Footer</span>
                </FooterContent>
              }
            >
              <ExampleDefaultContent>
                <span>Default content</span>
              </ExampleDefaultContent>
            </Help>
          </LocaleIntlProvider>
        </HelpWrapper>
      </Page>
    </ExampleWrapper>
  );
};

export default Example;
  `}

  ${(<Props props={helpProps} />)}
`;
