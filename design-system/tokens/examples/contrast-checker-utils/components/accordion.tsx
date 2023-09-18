/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { Fragment, useState } from 'react';

import { jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import Lozenge from '@atlaskit/lozenge';
import { Box, Flex, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

/**
 * Accordion for displaying content
 */
export default function Accordion({
  description,
  appearance = 'information',
  size,
  children,
}: {
  description: string;
  appearance?: 'information' | 'warning' | 'danger' | 'success';
  size?: number;
  children: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const appearanceMapping = {
    information: 'inprogress',
    warning: 'moved',
    danger: 'removed',
    success: 'success',
  } as const;

  const handleToggle = (event: React.ChangeEvent<HTMLDetailsElement>) => {
    setIsOpen(event.currentTarget.open);
  };

  return (
    <Fragment>
      {children ? (
        <details
          onToggle={handleToggle}
          open={isOpen}
          css={{
            alignItems: 'center',
            border: `1px solid ${token('color.border')}`,
            borderRadius: '4px',
            overflow: 'hidden',
            padding: '0em 0.5em',
            transition: 'background 0.2s ease-in',
          }}
        >
          <summary
            css={[
              {
                margin: '0em -0.5em 0',
                padding: '1em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                '&::-webkit-details-marker': {
                  display: 'none',
                },
                ':hover': {
                  background: token('color.background.neutral.subtle.hovered'),
                },
                ':active': {
                  background: token('color.background.neutral.subtle.pressed'),
                },
              },
            ]}
          >
            <Box
              xcss={xcss({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'space.050',
              })}
              as="span"
            >
              <Flex
                xcss={xcss({
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease-out',
                  alignItems: 'center',
                })}
              >
                <ChevronRightLargeIcon label={isOpen ? 'Close' : 'Open'} />
              </Flex>
              <Heading level="h600">{description}</Heading>
              {size !== undefined && (
                <Lozenge
                  appearance={
                    size > 0 ? appearanceMapping[appearance] : 'default'
                  }
                >
                  {size}
                </Lozenge>
              )}
            </Box>
          </summary>
          {isOpen && children && (
            <Box
              xcss={xcss({
                paddingBlock: 'space.100',
              })}
            >
              {children}
            </Box>
          )}
        </details>
      ) : null}
    </Fragment>
  );
}
