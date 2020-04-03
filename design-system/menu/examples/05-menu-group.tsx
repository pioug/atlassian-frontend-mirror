import React from 'react';
import {
  PopupMenuGroup,
  MenuGroup,
  Section,
  ButtonItem,
  LinkItem,
  HeadingItem,
  SkeletonItem,
  SkeletonHeadingItem,
} from '../src';

import Archive24Icon from '@atlaskit/icon-file-type/glyph/archive/24';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import Blog24Icon from '@atlaskit/icon-object/glyph/blog/24';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import StarIcon from '@atlaskit/icon/glyph/star';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';
import PresenceActiveIcon from '@atlaskit/icon/glyph/presence-active';

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: '1rem',
      }}
    >
      <div
        style={{
          border: '1px solid #EFEFEF',
          borderRadius: '4px',
        }}
      >
        <MenuGroup
          testId="with-adjacent-sections"
          maxWidth={600}
          maxHeight={1000}
        >
          <Section title="Actions">
            <LinkItem
              elemBefore={<EditorSearchIcon label="Search Icon" />}
              href="#"
            >
              Search your items
            </LinkItem>
            <LinkItem
              elemBefore={<EditFilledIcon label="Editor Icon" />}
              href="#"
              isDisabled
            >
              Add new item (disabled)
            </LinkItem>
            <LinkItem
              elemBefore={<StarFilledIcon label="Star icon" />}
              elemAfter={<ArrowRightIcon label="" />}
              description="You have 24 starred items."
              href="#"
            >
              Starred items
            </LinkItem>
            <LinkItem
              elemAfter={<ArrowRightIcon label="" />}
              elemBefore={<Archive24Icon label="Quote icon" />}
              description="You have 16 archived items."
              href="#"
            >
              Archived items
            </LinkItem>
          </Section>
          <Section title="More actions">
            <LinkItem
              elemBefore={<EditorSearchIcon label="Search Icon" />}
              href="#"
            >
              Edit your items
            </LinkItem>
            <LinkItem
              elemBefore={<TrashIcon label="Delete Icon" />}
              href="#"
              isDisabled
            >
              Delete item (disabled)
            </LinkItem>
            <LinkItem
              elemBefore={<StarIcon label="Star icon" />}
              elemAfter={<ArrowRightIcon label="" />}
              description="You have 24 unstarred items."
              href="#"
            >
              Unstarred items
            </LinkItem>
            <LinkItem
              elemAfter={<ArrowRightIcon label="" />}
              elemBefore={<PresenceActiveIcon label="Active icon" />}
              description="You have 16 archived items."
              href="#"
            >
              Active items
            </LinkItem>
          </Section>
          <Section title="Favourite articles" hasSeparator isScrollable>
            <ButtonItem elemBefore={<Blog24Icon label="Quote icon" />}>
              Untitled
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="It's short and sweet."
            >
              Short stories of Albany
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Success often comes with a shadow side and hidden costs. In this article, we examine the shadow side of Pablo Picasso's genius."
            >
              The Shadow Side of Greatness
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Self-awareness is critical for success in all fields. Read this article to learn how biologist Louis Agassiz taught self-awareness through observation."
            >
              Famous Biologist Louis Agassiz on the Usefulness of Learning
              Through Observation
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Famous poet Joseph Brodsky was exiled from his home in Russia and forced to leave the love of his life behind, never to be seen again. In 1988, Brodsky shared a beautiful strategy and method for dealing with the critics, detractors, and negative influences in your life."
            >
              Joseph Brodsky Explains Perfectly How to Deal With Critics and
              Detractors in Your Life:
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Martha Graham, perhaps the most influential dance choreographer of the 20th century, explains why it is not your job to judge your own work"
            >
              Martha Graham on the Hidden Danger of Comparing Yourself to Others
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Actress Nichelle Nichols helped shape the Civil Rights Movement without realizing it. Read this article to learn how you can live a meaningful life."
            >
              Lessons on Living a Meaningful Life from Nichelle Nichols
            </ButtonItem>
          </Section>
          <Section hasSeparator>
            <SkeletonHeadingItem />
            <SkeletonItem hasAvatar />
            <SkeletonItem hasAvatar />
            <SkeletonItem hasIcon width="100%" />
            <SkeletonItem hasIcon width="100%" />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
          </Section>
        </MenuGroup>
      </div>
      <div
        style={{
          border: '1px solid #EFEFEF',
          height: 'max-content',
          borderRadius: '4px',
        }}
      >
        <PopupMenuGroup testId="mock-starred-menu" maxHeight={500}>
          <Section isScrollable>
            <HeadingItem>Scrollable Starred</HeadingItem>
            <ButtonItem
              description="Software Project"
              elemBefore={<Blog24Icon label="Quote icon" />}
              elemAfter={
                <StarFilledIcon label="" primaryColor="rgb(255, 171, 0)" />
              }
            >
              Endeavour (JSPA)
            </ButtonItem>
            <ButtonItem
              description="Software Project"
              elemBefore={<Blog24Icon label="Quote icon" />}
              elemAfter={
                <StarFilledIcon label="" primaryColor="rgb(255, 171, 0)" />
              }
            >
              Navigation v3 (JNAV)
            </ButtonItem>
            <HeadingItem>Recent</HeadingItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Software Project"
            >
              Emanada (EM)
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Software Project"
            >
              Jira Frontend Performance Initiative (PEAR)
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Software Project"
            >
              Fabric Editor
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Next-gen software project"
            >
              Content Services
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Classic business project"
            >
              Trinity Mobile
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Classic service desk"
            >
              SPA Performance (SPAPERF)
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Software Project"
            >
              Moneyball Design (EXM)
            </ButtonItem>
            <ButtonItem
              elemBefore={<Blog24Icon label="Quote icon" />}
              description="Software Project"
            >
              3Sia (CZAM)
            </ButtonItem>
          </Section>
          <Section hasSeparator>
            <LinkItem href="#">View all projects</LinkItem>
            <ButtonItem onClick={() => {}}>Create project</ButtonItem>
          </Section>
        </PopupMenuGroup>
      </div>
    </div>
  );
};
