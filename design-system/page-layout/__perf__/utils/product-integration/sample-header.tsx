/** @jsx jsx */
import { jsx } from '@emotion/react';

import Icon from '@atlaskit/icon';
import { CustomItemComponentProps } from '@atlaskit/menu';
import { Header } from '@atlaskit/side-navigation';

const Container = (props: CustomItemComponentProps) => {
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  return <div {...props} />;
};

const ExampleHeader = () => {
  return (
    <Header
      component={Container}
      description="Next-gen service desk"
      iconBefore={<Icon label="" size="medium" />}
    >
      NXTGen Industries
    </Header>
  );
};

export default ExampleHeader;
