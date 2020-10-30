/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { HashRouter, Link } from 'react-router-dom';
import Question from '@atlaskit/icon/glyph/question';
import Arrow from '@atlaskit/icon/glyph/arrow-right';
import Avatar from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors, gridSize } from '@atlaskit/theme';
import Item from '../src';
import {
  DropImitation,
  GroupsWrapper,
  ItemsNarrowContainer,
} from './styled/StoryHelpers';

import ItemThemeDemo from './00-basic';

// eslint-disable-next-line react/prop-types
const Icon = () => <Question label="test question" />;

const RouterLink = class RouterLinkBase extends Component {
  render() {
    const { children, className, href } = this.props;
    return (
      <Link className={className} to={href}>
        {children}
      </Link>
    );
  }
};

// eslint-disable-next-line react/no-multi-comp
export default class ItemStory extends Component {
  render() {
    return (
      <div>
        `@atlaskit/item - ItemGroup`
        <div>
          Simple Item
          <GroupsWrapper>
            <p>This is an example of simple items with or without links</p>
            <DropImitation>
              <Item href="//atlassian.com">
                This link will reload this window
              </Item>
              <Item>This is just a standard item</Item>
              <Item href="//atlassian.com" target="_blank">
                This link will open in another tab
              </Item>
            </DropImitation>
          </GroupsWrapper>
        </div>
        <div>
          with different themes
          <GroupsWrapper>
            <p>
              The generic Item component controls the layout of standard item
              content. The styles of this layout can be customised by providing
              a theme.
            </p>
            <ItemThemeDemo title="Gray with standard padding" />
            <ItemThemeDemo
              title="Purple with less padding"
              padding={gridSize() * 0.75}
              backgroundColor={colors.P75}
              secondaryTextColor={colors.P400}
              focusColor={colors.N500}
            />
            <ItemThemeDemo
              title="Dark with more padding and light text"
              padding={gridSize() * 2}
              backgroundColor={colors.N500}
              textColor={colors.N0}
              secondaryTextColor={colors.N40}
            />
          </GroupsWrapper>
        </div>
        <div>
          simple item with icons
          <GroupsWrapper>
            <p>This is an example of items with icons</p>
            <DropImitation>
              <Item elemBefore={<Icon />}>First item</Item>
              <Item elemBefore={<Icon />}>Second item</Item>
              <Item elemBefore={<Icon />}>Third item</Item>
            </DropImitation>
          </GroupsWrapper>
        </div>
        <div>
          simple item with avatars
          <GroupsWrapper>
            <p>This is an example of droplist items with avatars</p>
            <DropImitation>
              <Item elemBefore={<Avatar size="small" />}>First item</Item>
              <Item elemBefore={<Avatar size="small" />}>Second item</Item>
              <Item elemBefore={<Avatar size="small" />}>Third item</Item>
            </DropImitation>
          </GroupsWrapper>
        </div>
        <div>
          simple item with additional space
          <GroupsWrapper>
            <p>
              This is an example of items with additional space to the right
            </p>
            <DropImitation>
              <Item
                elemAfter={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '105px',
                    }}
                  >
                    <Arrow label="" />
                    <Lozenge appearance="success">done</Lozenge>
                  </div>
                }
              >
                first item
              </Item>
              <Item
                elemAfter={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '105px',
                    }}
                  >
                    <Arrow label="" />
                    <Lozenge appearance="inprogress">in progress</Lozenge>
                  </div>
                }
                title="title for this long item"
              >
                second item with very long text that is going to be cut off
              </Item>
            </DropImitation>
          </GroupsWrapper>
        </div>
        <div>
          disabled items
          <GroupsWrapper>
            <p>This is an example of disabled items</p>
            <DropImitation>
              <Item elemBefore={<Icon />} isDisabled>
                First item
              </Item>
              <Item isDisabled>Second item</Item>
              <Item href="//atlassian.com" target="_blank" isDisabled>
                This link will open in another tab
              </Item>
            </DropImitation>
          </GroupsWrapper>
        </div>
        <div>
          hidden items
          <GroupsWrapper>
            <p>This is an example of a hidden item not being visible</p>
            <DropImitation>
              <Item description="'Second item' should not be visible">
                First item
              </Item>
              <Item isHidden>Second item</Item>
              <Item>Third item</Item>
            </DropImitation>
          </GroupsWrapper>
        </div>
        <div>
          shouldAllowMultiLine items
          <GroupsWrapper>
            <p>This is an example of a hidden item not being visible</p>
            <DropImitation>
              <Item elemAfter={<Icon />} elemBefore={<Icon />}>
                This line will not break on to a new line because it does not
                have shouldAllowMultiline enabled
              </Item>
              <Item
                elemAfter={<Icon />}
                elemBefore={<Icon />}
                shouldAllowMultiline
              >
                This line will break once it reaches the end because it has the
                shouldAllowMultiline prop set which is really a truly great
                thing when you have lots of text.
              </Item>
              <Item
                elemAfter={<Icon />}
                elemBefore={<Icon />}
                shouldAllowMultiline
              >
                Prop set here but not much text
              </Item>
            </DropImitation>
          </GroupsWrapper>
        </div>
        <div>
          with description ellipsis
          <GroupsWrapper>
            <p>This item description is really long so should be truncated.</p>
            <DropImitation>
              <Item description="Hello I am a super long description please truncate me before I get crazy">
                The description below should truncate
              </Item>
            </DropImitation>
          </GroupsWrapper>
        </div>
        <div>
          wrapped in a tooltip
          <GroupsWrapper>
            <p>Hover over each item to reveal tooltips:</p>
            <ItemsNarrowContainer>
              <Tooltip content="I'm a tooltip" position="right">
                <Item>Tooltip to the right</Item>
              </Tooltip>
              <Tooltip content="I'm a tooltip">
                <Item>Item wrapped in a tooltip</Item>
              </Tooltip>
            </ItemsNarrowContainer>
          </GroupsWrapper>
        </div>
        <div>
          <p>
            with a custom linkComponent
            <HashRouter>
              <div>
                <GroupsWrapper>
                  <div>
                    <p>
                      <strong>Navigation links:</strong>
                    </p>
                    <Item href="/" linkComponent={RouterLink}>
                      Home
                    </Item>
                    <Item href="/route1" linkComponent={RouterLink}>
                      Route 1
                    </Item>
                    <Item href="/route2" linkComponent={RouterLink}>
                      Route 2
                    </Item>
                    <p>
                      <strong>Route:</strong>
                    </p>
                    <Switch>
                      <Route path="/route1">{() => 'This is route 1'}</Route>
                      <Route path="/route2">{() => 'This is route 2'}</Route>
                      <Route> {() => 'This is the home route'}</Route>
                    </Switch>
                  </div>
                </GroupsWrapper>
              </div>
            </HashRouter>
          </p>
        </div>
      </div>
    );
  }
}
