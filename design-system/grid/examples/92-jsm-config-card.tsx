/** @jsx jsx */
import { FC, Fragment } from 'react';

import { jsx } from '@emotion/react';

import { UNSAFE_Stack as Stack } from '@atlaskit/ds-explorations';
import Heading from '@atlaskit/heading';

import IconLink from './95-icon-link';

const JSMConfigCard: FC<{
  title: string;
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
    <Stack gap="space.150">
      <Heading as="h3" level="h600">
        {title}
      </Heading>
      {children}
    </Stack>
  );
};

export default JSMConfigCard;
