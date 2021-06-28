import React, { useState, useEffect } from 'react';
import RendererDemo from './helper/RendererDemo';
import { RadioGroup } from '@atlaskit/radio';
import nestedHeadersAdf from '../src/__tests__/__fixtures__/nested-headings-adf.json';
import { OptionsPropType } from '@atlaskit/radio/types';
import Button from '@atlaskit/button/standard-button';
import styled from 'styled-components';

const getHeaderIdsAsRadioOptions = () =>
  Array.from(document.querySelectorAll('.heading-anchor-wrapper')).map(
    ({ parentElement }) => {
      const headingId = parentElement && parentElement.getAttribute('id');

      return {
        value: headingId === null ? undefined : headingId,
        label: headingId,
        name: 'headingids',
      };
    },
  );

const HeadersIdList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Container = styled.div`
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default function Example() {
  const [headings, setHeadings] = useState<OptionsPropType | undefined>();
  const [activeHeadingId, setActiveHeadingId] = useState<string | undefined>();
  const [rendererDemoExampleKey, setRendererDemoExampleKey] = useState(1);

  useEffect(() => {
    window.addEventListener('load', () => {
      setHeadings(getHeaderIdsAsRadioOptions());
    });
  }, []);

  useEffect(() => {
    setHeadings(getHeaderIdsAsRadioOptions());
  }, [rendererDemoExampleKey]);

  return (
    <RendererDemo
      key={`renderer-demo-example-${rendererDemoExampleKey}`}
      serializer="react"
      document={nestedHeadersAdf}
      disableSidebar
      disableEventHandlers
      actionButtons={
        <Container>
          <h4>Header Ids:</h4>
          <HeadersIdList>
            {headings ? (
              <RadioGroup
                options={headings}
                onChange={(event) =>
                  setActiveHeadingId(event.currentTarget.value)
                }
              />
            ) : null}
          </HeadersIdList>
          <Button
            onClick={() => {
              setActiveHeadingId(undefined);
              setRendererDemoExampleKey(rendererDemoExampleKey + 1);
            }}
          >
            Reset Document
          </Button>
        </Container>
      }
      onDocumentChange={() => setHeadings(getHeaderIdsAsRadioOptions())}
      allowHeadingAnchorLinks={{
        allowNestedHeaderLinks: true,
        activeHeadingId,
      }}
    />
  );
}
