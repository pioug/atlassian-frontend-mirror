/** @jsx jsx */
import { FC, Fragment, ReactNode } from 'react';

import { jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import Stack from '@atlaskit/primitives/stack';

import IconLink from './95-icon-link';

const JSMConfigCard: FC<{
  title: string;
  children?: ReactNode;
}> = ({
  children = (
    <Fragment>
      <IconLink>Join Figma support slack channel</IconLink>
      <IconLink>Request for laptop exchange</IconLink>
      <IconLink>Tutorials and shared resources</IconLink>
      <a href="#id">Show 3 more</a>
    </Fragment>
  ),
  title = 'Title',
}) => {
  return (
    <Stack space="space.150">
      <Heading as="h2" level="h600">
        {title}
      </Heading>
      {children}
    </Stack>
  );
};

export default JSMConfigCard;
