import React from 'react';

import styled from 'styled-components';

import { G400, G75, R75, Y75 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import ProfileCardClient from '../src/client/ProfileCardClient';
import TeamProfileCardClient from '../src/client/TeamProfileCardClient';
import TeamProfilecardTrigger from '../src/components/Team';
import teamData from '../src/mocks/team-data';
import { Team } from '../src/types';

const Table = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
`;

const Head = styled.th`
  border: 1px solid black;
`;

const Cell = styled.td`
  border: 1px solid black;
`;

const Text = styled.p`
  font-weight: initial;
`;

const TriggerText = styled.span`
  border-radius: 3px;
  padding: 4px;
`;

const team = teamData({});

class MockTeamClient extends TeamProfileCardClient {
  makeRequest(): Promise<Team> {
    return Promise.resolve(team);
  }
}

const args = { cacheSize: 10, maxCacheAge: 0, url: 'DUMMY' };

const profileClient = new ProfileCardClient(args, {
  teamClient: new MockTeamClient(args),
});

interface TriggerKind {
  trigger: 'hover' | 'click' | 'hover-click';
  triggerLinkType: 'none' | 'link' | 'clickable-link';
  color: string;
  whiteText?: boolean;
}

function Trigger(props: TriggerKind) {
  return (
    <TeamProfilecardTrigger
      orgId="DUMMY"
      resourceClient={profileClient}
      teamId="team"
      viewProfileLink="about:blank"
      trigger={props.trigger}
      triggerLinkType={props.triggerLinkType}
      // actions={actions.slice(0, props.numActions)}
    >
      <TriggerText
        style={{
          backgroundColor: props.color,
          color: props.whiteText ? 'white' : 'black',
        }}
      >
        trigger
      </TriggerText>
    </TeamProfilecardTrigger>
  );
}

export default function TriggerTypeTable() {
  return (
    <div
      style={{
        padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
      }}
    >
      <p>
        All of these options are available and described here for completeness.
        In practice only a small number of these will be used, but having them
        all available and giving a description of the suitability of each will
        reduce the chances of us having to add a new form of interaction later.
      </p>
      <p>
        If you’re going to add the team profile card to your product please
        choose sensibly from these options and consider accessibility.
      </p>
      <p>
        <input value="Sample" type="text" />
        <button>Purely demo purposes</button>
      </p>
      <Table>
        <tr>
          <Head>
            <p>Link type →</p>
            <p>Card triggers on ↓</p>
          </Head>
          <Head>
            <p>No link</p>
            <Text>
              No href/interactivity added to the element. Users (especially
              those using keyboard or a screen-reader) may not realise there is
              a profile card here.
            </Text>
            <Text>
              Preferrably only use this if you are wrapping the trigger in a
              link yourself.
            </Text>
          </Head>
          <Head>
            <p>Link</p>
            <Text>This is usually the recommended approach.</Text>
            <Text>
              The trigger will now behave as a link to the team, but the
              on-click has been suppressed. Users can still access the link via
              cmd+enter (keyboard open in new tab shortcuts) or right-click+open
              in new tab, cmd+click, etc.
            </Text>
          </Head>
          <Head>
            <p>Clickable link</p>
            <Text>
              Not highly recommended unless the trigger is really <i>only</i> a
              link to the team profile page.
            </Text>
            <Text>
              Clicking the trigger will navigate to the team's profile page.
              Keyboard/screen-reader users cannot view the profile card as all
              they can do to interact is click.
            </Text>
          </Head>
        </tr>
        <tr>
          <Head>
            <p>Hover</p>
            <Text>
              Keyboard users can <i>never</i> open the profile card. Avoid
              unless the profile-card is superfluous and you'd rather users
              simply click through the view the team profile.
            </Text>
          </Head>
          <Cell>
            <Trigger trigger="hover" triggerLinkType="none" color={Y75} />
            <p>
              Only recommended for use cases where you are already wrapping the
              trigger in something like a link.
            </p>
          </Cell>
          <Cell>
            <Trigger trigger="hover" triggerLinkType="link" color={Y75} />
            <p>
              This is confusing for screen-reader users. The trigger is a link
              that they cannot click through. (They can still open in new tab)
            </p>
          </Cell>
          <Cell>
            <Trigger
              trigger="hover"
              triggerLinkType="clickable-link"
              color={G75}
            />
            <p>
              This is okay for use cases where the trigger is primarily a link
              to the team profile and the card is secondary.
            </p>
          </Cell>
        </tr>
        <tr>
          <Head>
            <p>Click</p>
            <Text>
              Recommended generally for accessibility reasons. Trigger method is
              unambiguous and supports keyboard and mouse users equally.
            </Text>
          </Head>
          <Cell>
            <Trigger trigger="click" triggerLinkType="none" color={R75} />
            <p>
              Confusing for screen reader users. No indication that this is
              interactible.
            </p>
          </Cell>
          <Cell>
            <Trigger
              trigger="click"
              triggerLinkType="link"
              color={G400}
              whiteText
            />
            <p>
              The most highly recommended behaviour. Easy to interact with and
              suitable for mouse and keyboard/screen-reader users. Link is also
              very useful.
            </p>
          </Cell>
          <Cell>
            <Trigger
              trigger="click"
              triggerLinkType="clickable-link"
              color={R75}
            />
            <p>
              This behaviour doesn't make much sense, since trying to open the
              profile card by clicking just navigates you away.
            </p>
          </Cell>
        </tr>
        <tr>
          <Head>
            <p>Hover-click</p>
            <Text>
              Suitable for cases where mouse users <i>cannot</i> click on the
              trigger, e.g. the read view of an inline edit (looking at you,
              Jira team field)
            </Text>
          </Head>
          <Cell>
            <Trigger trigger="hover-click" triggerLinkType="none" color={R75} />
            <p>Not useful to keyboard/screen-reader users.</p>
            <p>Either of the above combinations would be better than this.</p>
          </Cell>
          <Cell>
            <Trigger trigger="hover-click" triggerLinkType="link" color={G75} />
            <p>
              The perfect scenario for when mouse users cannot click the
              trigger, e.g. in an inline edit (like a Jira team field).
            </p>
          </Cell>
          <Cell>
            <Trigger
              trigger="hover-click"
              triggerLinkType="clickable-link"
              color={R75}
            />
            <p>
              Not substantially different from a hover-only clickable-link, as
              keyboard users cannot reasonably open the profile card in either
              case.
            </p>
          </Cell>
        </tr>
      </Table>
    </div>
  );
}
