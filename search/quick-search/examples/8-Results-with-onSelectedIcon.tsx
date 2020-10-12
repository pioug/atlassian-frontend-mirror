import React from 'react';
import Navigation, { AkSearchDrawer } from '@atlaskit/navigation';
import {
  randomJiraIconUrl,
  randomConfluenceIconUrl,
  getContainerAvatarUrl,
  getPersonAvatarUrl,
} from './utils/mockData';
import {
  QuickSearch,
  ObjectResult,
  ContainerResult,
  PersonResult,
  ResultItemGroup,
} from '../src';

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
                  <ObjectResult
                    resultId="1"
                    name="quick-search is too hilarious!"
                    avatarUrl={randomJiraIconUrl()}
                    objectKey="AK-007"
                    containerName="Search'n'Smarts"
                    selectedIcon="↩️"
                  />
                  <ObjectResult
                    resultId="2"
                    avatarUrl={randomConfluenceIconUrl()}
                    name="Yeah, I cut my dev loop in half, but you'll never guess what happened next!"
                    containerName="Buzzfluence"
                    selectedIcon="↩️"
                  />
                  <ContainerResult
                    resultId="3"
                    avatarUrl={getContainerAvatarUrl(3)}
                    name="Cargo boxes"
                    subText="They're big!"
                    selectedIcon="↩️"
                  />
                  <ContainerResult
                    resultId="4"
                    isPrivate
                    name="Private container"
                    selectedIcon="↩️"
                  />
                  <PersonResult
                    resultId="5"
                    avatarUrl={getPersonAvatarUrl('qgjinn')}
                    mentionName="MasterQ"
                    name="Qui-Gon Jinn"
                    presenceMessage="On-call"
                    presenceState="offline"
                    selectedIcon="↩️"
                  />
                </ResultItemGroup>
              </div>
            </QuickSearch>
          </AkSearchDrawer>,
        ]}
      />
    );
  }
}
