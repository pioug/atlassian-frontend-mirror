import React from 'react';
import Navigation, { AkSearchDrawer } from '@atlaskit/navigation';
import { randomJiraIconUrl, randomConfluenceIconUrl } from './utils/mockData';
import { QuickSearch, ResultItemGroup, ObjectResult } from '../src';

const ResultWrapperStateless = () => (
  <ObjectResult
    resultId="2"
    avatarUrl={randomConfluenceIconUrl()}
    name="Yeah, I cut my dev loop in half, but you'll never guess what happened next!"
    containerName="Buzzfluence"
  />
);

class ResultWrapperClass extends React.Component {
  static defaultProps = {
    resultId: '3',
  };

  render() {
    return (
      <ObjectResult
        resultId="3"
        avatarUrl={randomConfluenceIconUrl()}
        name="Prank schedule: April 2017"
        containerName="The Scream Team"
        isPrivate
      />
    );
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component {
  render() {
    return (
      <Navigation
        drawers={[
          <AkSearchDrawer
            backIcon={null}
            isOpen
            onBackButton={() => {}}
            key="search"
            primaryIcon={null}
          >
            <QuickSearch isLoading={false}>
              <div>
                <ResultItemGroup title="Object examples">
                  <span>
                    <ObjectResult
                      resultId="1"
                      name="quick-search is too hilarious!"
                      avatarUrl={randomJiraIconUrl()}
                      objectKey="AK-007"
                      containerName="Search'n'Smarts"
                    />
                  </span>

                  <ResultWrapperStateless />
                  <ResultWrapperClass />
                </ResultItemGroup>
              </div>
            </QuickSearch>
          </AkSearchDrawer>,
        ]}
      />
    );
  }
}
