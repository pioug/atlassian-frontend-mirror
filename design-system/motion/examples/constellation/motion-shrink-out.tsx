/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { ExitingPersistence, ShrinkOut } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block, Centered } from '../../examples-utils';

const MotionShrinkOutExample = () => {
  const [actualProducts, setProducts] = useState(products);

  return (
    <div>
      <div css={containerStyles}>
        <ButtonGroup>
          <Button onClick={() => setProducts(products)}>Reset</Button>
        </ButtonGroup>
      </div>

      <Centered css={centeredStyles}>
        <ExitingPersistence>
          {actualProducts.map((product) => (
            <ShrinkOut key={product}>
              {(props) => (
                <Block {...props} appearance="small" css={blockStyles}>
                  <Button
                    onClick={() => {
                      setProducts((prods) =>
                        prods.filter((val) => val !== product),
                      );
                    }}
                  >
                    {product}
                  </Button>
                </Block>
              )}
            </ShrinkOut>
          ))}
        </ExitingPersistence>
      </Centered>
    </div>
  );
};

const products = [
  'Confluence',
  'Bitbucket',
  'Jira Service Management',
  'Opsgenie',
  'Statuspage',
  'Jira Software',
];

const containerStyles = css({ textAlign: 'center' });

const centeredStyles = css({ height: '82px' });

const blockStyles = css({
  width: 'auto',
  margin: token('space.050', '4px'),
  overflow: 'hidden',
});

export default MotionShrinkOutExample;
