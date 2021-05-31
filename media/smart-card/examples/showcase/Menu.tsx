import React from 'react';
import Select, { OptionsType } from '@atlaskit/select';
import { N50A, N40A, N200 } from '@atlaskit/theme/colors';
import styled from 'styled-components';

import { CardAppearance } from '../../src';
import { CardAuthFlowOpts } from '../../src/state/context/types';
import { EnvironmentsKeys } from '../../src/client/types';
import { ExampleUIConfig } from './types';

interface ViewTypeOption {
  label: string;
  value: CardAppearance;
}
interface AuthFlowOption {
  label: string;
  value: CardAuthFlowOpts['authFlow'];
}
interface EnvironmentOption {
  label: string;
  value: EnvironmentsKeys;
}

const viewTypeOptions: OptionsType<ViewTypeOption> = [
  { label: 'Inline', value: 'inline' },
  { label: 'Card', value: 'block' },
  { label: 'Embed', value: 'embed' },
];
const authFlowOptions: OptionsType<AuthFlowOption> = [
  { label: 'OAuth2', value: 'oauth2' },
  { label: 'Disabled', value: 'disabled' },
];
const environmentOptions: OptionsType<EnvironmentOption> = [
  { label: 'Staging', value: 'stg' },
  { label: 'Production', value: 'prod' },
];

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  margin-right: 24px;
`;
const MenuTitle = styled.h6`
  margin-bottom: 8px;
  color: ${N200};
`;

interface ShowcaseMenuProps {
  onViewTypeChange: (appearance: CardAppearance) => void;
  onAuthFlowChange: (authFlow: CardAuthFlowOpts['authFlow']) => void;
  onEnvironmentChange: (environment: EnvironmentsKeys) => void;
  onEntityChange: (entities: string[]) => void;
  entities: string[];
  config: ExampleUIConfig;
}

export const ShowcaseMenu = ({
  onViewTypeChange,
  onAuthFlowChange,
  onEnvironmentChange,
  onEntityChange,
  entities,
  config,
}: ShowcaseMenuProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '24px 60px',
        backgroundColor: 'white',
        boxShadow: `0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`,
        display: 'flex',
        zIndex: 500,
      }}
    >
      <MenuWrapper>
        <MenuTitle>View Type</MenuTitle>
        <Select
          menuPosition="fixed"
          defaultValue={viewTypeOptions.find(
            (option) => option.value === config.appearance,
          )}
          options={viewTypeOptions}
          onChange={(evt) => {
            if (evt) {
              onViewTypeChange((evt as ViewTypeOption).value);
            }
          }}
        />
      </MenuWrapper>
      <MenuWrapper>
        <MenuTitle>Auth Flow</MenuTitle>
        <Select
          menuPosition="fixed"
          defaultValue={authFlowOptions.find(
            (option) => option.value === config.authFlow,
          )}
          options={authFlowOptions}
          onChange={(evt) => {
            if (evt) {
              onAuthFlowChange((evt as AuthFlowOption).value);
            }
          }}
        />
      </MenuWrapper>
      <MenuWrapper>
        <MenuTitle>Environment</MenuTitle>
        <Select
          menuPosition="fixed"
          defaultValue={environmentOptions.find(
            (option) => option.value === config.environment,
          )}
          options={environmentOptions}
          onChange={(evt) => {
            if (evt) {
              onEnvironmentChange((evt as EnvironmentOption).value);
            }
          }}
        />
      </MenuWrapper>
      <MenuWrapper>
        <MenuTitle>Entity</MenuTitle>
        <Select
          menuPosition="fixed"
          isMulti={true}
          defaultValue={config.selectedEntities.map((selectedEntity) => ({
            label: selectedEntity,
            value: selectedEntity,
          }))}
          options={entities.map((entity) => ({ label: entity, value: entity }))}
          onChange={(evt) => {
            if (evt) {
              onEntityChange((evt as EnvironmentOption[]).map((e) => e.value));
            }
          }}
          placeholder="Filter by entity..."
        />
      </MenuWrapper>
    </div>
  );
};
