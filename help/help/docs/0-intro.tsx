import React from 'react';
import { md, code, Props, AtlassianInternalWarning } from '@atlaskit/docs';

const helpProps = require('!!extract-react-types-loader!../src/components/Help');

export default md`
  ${(<AtlassianInternalWarning />)}

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

const client = algoliasearch(<application-id>, <api-key>);
const index = client.initIndex(<index-name>);

const Example = () => {
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
