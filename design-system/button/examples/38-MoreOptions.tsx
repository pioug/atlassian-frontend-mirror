/** @jsx jsx */
import React, { useState } from 'react';

import { jsx } from '@emotion/core';

import Expand from '@atlaskit/icon/glyph/arrow-down';
import Calendar from '@atlaskit/icon/glyph/calendar';
import Open from '@atlaskit/icon/glyph/editor/open';
import Unlink from '@atlaskit/icon/glyph/editor/unlink';
import Page from '@atlaskit/icon/glyph/page';
import Question from '@atlaskit/icon/glyph/question';

import { Appearance } from '../src';
import Button, { ButtonProps } from '../src/button';

const styles = {
  sample: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: '1px solid',
    paddingBottom: '10px',
    paddingTop: '10px',
  },
  purpleBorder: {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    border: '1px solid purple',
  },
  pinkBg: {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    backgroundColor: 'pink !important',
  },
  truncated: {
    maxWidth: '100px',
  },
  buttonContainer: {
    '> a': {
      marginRight: '5px',
    },
    '> button': {
      marginRight: '5px',
    },
    '.sample > a': {
      marginRight: '5px',
    },
    '.sample > button': {
      marginRight: '5px',
    },
  },
};

const CustomComponent = React.forwardRef<HTMLDivElement, {}>((props, ref) => (
  <div {...props} ref={ref}>
    {props.children}
  </div>
));

const BuildStory = (props: ButtonProps) => (
  <div css={{ padding: '10px' }}>
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
      }}
    >
      <div css={styles.sample}>
        <Button {...props}>Create Issue</Button>
        <span>no extra attrs</span>
      </div>

      <div css={styles.sample}>
        <Button {...props} href="//www.atlassian.com">
          Create Issue
        </Button>
        <span>with href attribute</span>
      </div>

      <div css={styles.sample}>
        <Button {...props} href="//www.atlassian.com">
          Create Issue
        </Button>
        <span>with href attribute + no target</span>
      </div>

      <div css={styles.sample}>
        <span>
          text
          <Button
            {...props}
            onClick={() => console.log('clicking the Component')}
          >
            Create Issue
          </Button>
          text
        </span>
        <span>click event + text alignment check</span>
      </div>

      <div css={styles.sample}>
        <Button
          {...props}
          isDisabled
          onClick={() => console.log('clicking the Component')}
        >
          Disabled Option
        </Button>
        <span>disabled</span>
      </div>

      <div css={styles.sample}>
        <Button
          {...props}
          isDisabled
          onClick={() => console.log('clicking the Component')}
          href="//www.atlassian.com"
          target="_blank"
        >
          Go to Site
        </Button>
        <span>disabled + href + target</span>
      </div>

      <div css={styles.sample}>
        {
          // @ts-ignore
          <Button {...props} component={CustomComponent} to="/custom-link">
            With a custom component
          </Button>
        }
      </div>

      <div css={styles.sample}>
        <Button {...props} css={[styles.purpleBorder, styles.pinkBg]}>
          Custom classes with crazy colors
        </Button>
        <span>custom classes</span>
      </div>

      <div css={styles.sample}>
        <Button {...props} css={styles.truncated}>
          Truncated text which is very long and has many words to demonstrate
          truncation
        </Button>
        <span>truncated</span>
      </div>

      <div css={styles.sample}>
        <Button {...props} isSelected>
          Selected
        </Button>
        <span>selected</span>
      </div>

      <div css={styles.sample}>
        <Button {...props} iconBefore={<Page label="page icon" />}>
          Comment
        </Button>
        <span>button + text with page icon</span>
      </div>

      <div css={styles.sample}>
        <span>
          text
          <Button
            {...props}
            iconBefore={<Question label="question icon">Question</Question>}
          >
            Info
          </Button>
          text
        </span>
        <span>button + text with question icon + text alignment check</span>
      </div>

      <div css={styles.sample}>
        <span>
          text
          <Button
            {...props}
            isSelected
            iconAfter={<Calendar label="calendar icon" />}
          >
            Pick Date
          </Button>
          text
        </span>
        <span>
          button + text with calendar icon + text alignment check + selected
        </span>
      </div>

      <div css={styles.sample}>
        <Button {...props} iconAfter={<Expand label="expand icon" />}>
          Show Options
        </Button>
        <span>button + text with expand icon</span>
      </div>

      <div css={styles.sample}>
        <Button
          {...props}
          href="//www.atlassian.com"
          iconBefore={<Page label="page icon" />}
        />
        <span>button with Page icon + href</span>
      </div>

      <div css={styles.sample}>
        <Button
          {...props}
          href="//www.atlassian.com"
          target="_blank"
          iconBefore={<Expand label="expand icon" />}
        />
        <span>button with icons + href + target</span>
      </div>

      <div css={styles.sample}>
        <span>
          text
          <Button {...props} iconBefore={<Calendar label="calendar icon" />} />
          text
        </span>
        <span>button with Calendar icon + text alignment check</span>
      </div>

      <div css={styles.sample}>
        <Button
          {...props}
          isSelected
          iconBefore={<Question label="question icon">Question</Question>}
        />
        <span>button with Question icon + selected</span>
      </div>

      <div css={styles.sample}>
        <div css={styles.buttonContainer}>
          <Button {...props} spacing="none">
            1
          </Button>
          <Button {...props} spacing="compact">
            1
          </Button>
          <Button {...props}>1</Button>
        </div>
        <span>Button with small text</span>
      </div>

      <div css={styles.sample}>
        <div css={styles.buttonContainer}>
          <Button
            {...props}
            spacing="none"
            iconBefore={<Unlink label="unlink icon">unlink</Unlink>}
          />
          <Button
            {...props}
            spacing="none"
            isSelected
            iconBefore={<Unlink label="unlink icon">unlink selected</Unlink>}
          />
          <Button
            {...props}
            spacing="none"
            iconBefore={<Open label="open icon">open</Open>}
          />
          <Button
            {...props}
            spacing="none"
            isSelected
            iconBefore={<Open label="open icon">open selected</Open>}
          />
        </div>
        <span>button with icons, no spacing &amp; selected</span>
      </div>

      <div css={styles.sample}>
        <Button {...props} spacing="compact">
          Create Issue
        </Button>
        <Button
          {...props}
          spacing="compact"
          iconBefore={<Page label="page icon">create issue</Page>}
        >
          Create Issue
        </Button>
        <span>compact</span>
      </div>

      <div css={styles.sample}>
        <Button
          {...props}
          onClick={() => console.log('clicking the Component')}
          spacing="compact"
          isDisabled
        >
          Disabled Option
        </Button>
        <span>compact + disabled</span>
      </div>

      <div css={styles.sample}>
        <Button {...props} spacing="compact" isSelected>
          Selected Option
        </Button>
        <span>compact + selected</span>
      </div>

      <div css={styles.sample}>
        <Button {...props} shouldFitContainer>
          Create Issue
        </Button>
        <span>shouldFitContainer</span>
      </div>

      <div css={styles.sample}>
        <Button
          {...props}
          iconBefore={<Page label="page icon" />}
          shouldFitContainer
        >
          Comment
        </Button>
        <span>shouldFitContainer with page icon</span>
      </div>
      <div css={styles.sample}>
        <Button
          {...props}
          iconBefore={<Page label="page icon" />}
          shouldFitContainer
        />
        <span>shouldFitContainer icon only</span>
      </div>
    </div>
  </div>
);

const appearances: Appearance[] = [
  'default',
  'danger',
  'link',
  'primary',
  'subtle',
  'subtle-link',
  'warning',
];

/* eslint-disable react/no-multi-comp */
export default function Example() {
  const [appearance, setAppearance] = useState<Appearance>('default');

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAppearance(event.target.value as Appearance);
  };

  return (
    <div>
      <h3>Select an appearance option to see its effects in contexts</h3>
      <select onChange={onChange} value={appearance}>
        {appearances.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <BuildStory appearance={appearance} />
    </div>
  );
}
