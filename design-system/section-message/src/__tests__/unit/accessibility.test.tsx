import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import SectionMessage, { SectionMessageAction } from '../../index';

it('Default SectionMessage should pass basic aXe audit', async () => {
  const { container } = render(
    <SectionMessage title="Default SectionMessage">
      <p>This is a default section message</p>
    </SectionMessage>,
  );
  await axe(container);
});

it('Default SectionMessage with actions should pass basic aXe audit', async () => {
  const { container } = render(
    <SectionMessage
      title="Default SectionMessage with actions"
      actions={[
        <SectionMessageAction href="atlassian.design">
          Learn more about ADS
        </SectionMessageAction>,
        <SectionMessageAction href="https://www.w3.org/WAI/ARIA/apg/">
          ARIA Authoring Practices
        </SectionMessageAction>,
      ]}
    >
      <p>This is a default section message</p>
    </SectionMessage>,
  );
  await axe(container);
});

it('Success SectionMessage with actions should pass basic aXe audit', async () => {
  const { container } = render(
    <SectionMessage
      appearance="success"
      title="Success SectionMessage with actions"
      actions={[
        <SectionMessageAction href="atlassian.design">
          Learn more about ADS
        </SectionMessageAction>,
        <SectionMessageAction href="https://www.w3.org/WAI/ARIA/apg/">
          ARIA Authoring Practices
        </SectionMessageAction>,
      ]}
    >
      <p>This is a success section message</p>
    </SectionMessage>,
  );
  await axe(container);
});

it('Warning SectionMessage with actions should pass basic aXe audit', async () => {
  const { container } = render(
    <SectionMessage
      appearance="warning"
      title="Warning SectionMessage with actions"
      actions={[
        <SectionMessageAction href="atlassian.design">
          Learn more about ADS
        </SectionMessageAction>,
        <SectionMessageAction href="https://www.w3.org/WAI/ARIA/apg/">
          ARIA Authoring Practices
        </SectionMessageAction>,
      ]}
    >
      <p>This is a warning section message</p>
    </SectionMessage>,
  );
  await axe(container);
});

it('Error SectionMessage with actions should pass basic aXe audit', async () => {
  const { container } = render(
    <SectionMessage
      appearance="error"
      title="Error SectionMessage with actions"
      actions={[
        <SectionMessageAction href="atlassian.design">
          Learn more about ADS
        </SectionMessageAction>,
        <SectionMessageAction href="https://www.w3.org/WAI/ARIA/apg/">
          ARIA Authoring Practices
        </SectionMessageAction>,
      ]}
    >
      <p>This is an error section message</p>
    </SectionMessage>,
  );
  await axe(container);
});

it('Discovery SectionMessage with actions should pass basic aXe audit', async () => {
  const { container } = render(
    <SectionMessage
      appearance="discovery"
      title="Discovery SectionMessage with actions"
      actions={[
        <SectionMessageAction href="atlassian.design">
          Learn more about ADS
        </SectionMessageAction>,
        <SectionMessageAction href="https://www.w3.org/WAI/ARIA/apg/">
          ARIA Authoring Practices
        </SectionMessageAction>,
      ]}
    >
      <p>This is a discovery section message</p>
    </SectionMessage>,
  );
  await axe(container);
});
