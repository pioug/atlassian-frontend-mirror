/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { DatasourceTableView } from '@atlaskit/link-datasource';
import { CardClient as SmartCardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { forceBaseUrl } from '@atlaskit/link-test-helpers/datasource';
import { type DatasourceAdf, type InlineCardAdf } from '@atlaskit/linking-common/types';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { Radio } from '@atlaskit/radio';
import { Card } from '@atlaskit/smart-card';
import TextArea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';

import { CONFLUENCE_SEARCH_DATASOURCE_ID } from '../src/ui/confluence-search-modal';
import { ConfluenceSearchConfigModal } from '../src/ui/confluence-search-modal/modal';
import {
	type ConfluenceSearchDatasourceAdf,
	type ConfluenceSearchDatasourceParameters,
} from '../src/ui/confluence-search-modal/types';

const styles = cssMap({
	tableContainerStyles: {
		width: '700px',
		height: '400px',
		overflow: 'scroll',
	},
	configurationBox: {
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
		marginTop: token('space.050'),
		marginRight: token('space.050'),
		marginBottom: token('space.050'),
		marginLeft: token('space.050'),
		display: 'inline-block',
		width: '400px',
	},
});

forceBaseUrl('https://pug.jira-dev.com');

const databaseATIs = ['ati:cloud:confluence:blogpost', 'ati:cloud:confluence:page'];

function PresetPicker({
	disableDisplayDropdown,
	overrideEntityTypes,
	onChange,
}: {
	disableDisplayDropdown: boolean;
	onChange: (overrideEntityTypes: string[], disableDropdown: boolean) => void;
	overrideEntityTypes: string[] | undefined;
}) {
	const isDatabasePreset = useMemo(() => {
		return (
			disableDisplayDropdown &&
			overrideEntityTypes &&
			JSON.stringify(overrideEntityTypes.sort()) === JSON.stringify(databaseATIs)
		);
	}, [disableDisplayDropdown, overrideEntityTypes]);

	return (
		<Box xcss={styles.configurationBox} backgroundColor="color.background.accent.lime.subtler">
			<Radio
				label="Custom"
				name="preset"
				isChecked={!isDatabasePreset}
				onChange={(e) => onChange([], false)}
			/>
			<Radio
				label="Database preset"
				name="preset"
				isChecked={isDatabasePreset}
				onChange={(e) => onChange(databaseATIs, true)}
			/>
		</Box>
	);
}

function OverrideEntityTypes({
	overrideEntityTypes,
	onChange,
}: {
	onChange: (override: string[] | undefined) => void;
	overrideEntityTypes: string[] | undefined;
}) {
	return (
		<Box xcss={styles.configurationBox} backgroundColor="color.background.accent.lime.subtler">
			<p>
				Override entity types:{' '}
				{overrideEntityTypes ? `${JSON.stringify(overrideEntityTypes)}` : '- -'}
			</p>
			<p>(Provide each value on a new line)</p>
			<TextArea
				id="entityTypesOverride"
				maxHeight="400px"
				resize="auto"
				name="entityTypesOverride"
				value={overrideEntityTypes?.join('\n') ?? ''}
				onChange={(e) => {
					onChange(e.target.value ? e.target.value.split('\n') : undefined);
				}}
			/>
		</Box>
	);
}

function DisableDisplayDropdownRadioToggle({
	disableDisplayDropdown,
	onChange,
}: {
	disableDisplayDropdown: boolean;
	onChange: (disabled: boolean) => void;
}) {
	return (
		<Box xcss={styles.configurationBox} backgroundColor="color.background.accent.lime.subtler">
			<p>Disable display dropdown: {`${disableDisplayDropdown}`}</p>
			<Radio
				label="True"
				name="disableDisplayDropdown"
				isChecked={disableDisplayDropdown}
				onChange={(e) => onChange(true)}
			/>
			<Radio
				label="False"
				name="disableDisplayDropdown"
				isChecked={!disableDisplayDropdown}
				onChange={(e) => onChange(false)}
			/>
		</Box>
	);
}

export default () => {
	const [generatedAdf, setGeneratedAdf] = useState<
		InlineCardAdf | ConfluenceSearchDatasourceAdf | DatasourceAdf | null
	>(null);
	const [overrideEntityTypes, setOverrideEntityTypes] = useState<string[] | undefined>(undefined);
	const [disableDisplayDropdown, setDisplayDropdownDisabled] = useState(false);
	const [showModal, setShowModal] = useState(true);
	const [parameters, setParameters] = useState<ConfluenceSearchDatasourceParameters | undefined>(
		undefined,
	);
	const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[] | undefined>(undefined);
	const toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);
	const closeModal = () => setShowModal(false);

	const onInsert = (adf: InlineCardAdf | ConfluenceSearchDatasourceAdf | DatasourceAdf) => {
		setGeneratedAdf(adf);
		closeModal();
	};

	useEffect(() => {
		if (!generatedAdf) {
			setParameters(undefined);
			setVisibleColumnKeys(undefined);
			return;
		}

		if (generatedAdf.type === 'blockCard') {
			setParameters(
				generatedAdf.attrs.datasource.parameters as ConfluenceSearchDatasourceParameters,
			);
			setVisibleColumnKeys(
				generatedAdf.attrs.datasource.views[0].properties?.columns.map((c) => c.key),
			);
		}
	}, [generatedAdf]);

	const resultingComponent = useMemo(() => {
		if (!generatedAdf) {
			return null;
		}

		if (generatedAdf.type === 'blockCard') {
			if (parameters) {
				return (
					<div>
						<div css={styles.tableContainerStyles}>
							In renderer:
							<DatasourceTableView
								datasourceId={generatedAdf.attrs.datasource.id}
								parameters={parameters}
								visibleColumnKeys={visibleColumnKeys}
								onVisibleColumnKeysChange={undefined} // readonly
							/>
						</div>
						<div css={styles.tableContainerStyles}>
							In Editor:
							<DatasourceTableView
								datasourceId={generatedAdf.attrs.datasource.id}
								parameters={parameters}
								visibleColumnKeys={visibleColumnKeys}
								onVisibleColumnKeysChange={setVisibleColumnKeys}
							/>
						</div>
					</div>
				);
			}
		} else {
			return <Card url={generatedAdf.attrs.url} appearance={'inline'} />;
		}
	}, [generatedAdf, parameters, visibleColumnKeys]);

	return (
		<Flex>
			<Box>
				<SmartCardProvider client={new SmartCardClient('staging')}>
					<h3>Parameters preset</h3>
					<PresetPicker
						disableDisplayDropdown={disableDisplayDropdown}
						overrideEntityTypes={overrideEntityTypes}
						onChange={(entityTypes, disableDropdown) => {
							setOverrideEntityTypes(entityTypes);
							setDisplayDropdownDisabled(disableDropdown);
						}}
					/>
					<h3>Customise values</h3>
					<Flex>
						<DisableDisplayDropdownRadioToggle
							disableDisplayDropdown={disableDisplayDropdown}
							onChange={(disabled) => setDisplayDropdownDisabled(disabled)}
						/>
						<OverrideEntityTypes
							overrideEntityTypes={overrideEntityTypes}
							onChange={(entityTypes) => setOverrideEntityTypes(entityTypes)}
						/>
					</Flex>
					<Flex>
						<Button appearance="primary" onClick={() => setGeneratedAdf(null)}>
							Clear ADF
						</Button>
						<Button appearance="primary" onClick={toggleIsOpen}>
							Toggle Modal
						</Button>
					</Flex>
					{resultingComponent}
					{showModal && (
						<ConfluenceSearchConfigModal
							datasourceId={CONFLUENCE_SEARCH_DATASOURCE_ID}
							visibleColumnKeys={visibleColumnKeys}
							parameters={parameters}
							onCancel={closeModal}
							onInsert={onInsert}
							disableDisplayDropdown={disableDisplayDropdown}
							overrideParameters={{
								entityTypes: overrideEntityTypes,
							}}
						/>
					)}
				</SmartCardProvider>
			</Box>
			<Box>
				<h3>Generated ADF:</h3>
				{JSON.stringify(generatedAdf)}
			</Box>
		</Flex>
	);
};
