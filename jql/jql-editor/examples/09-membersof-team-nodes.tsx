import React, { useCallback } from 'react';

import {
    type GetAutocompleteInitialData,
    type GetAutocompleteSuggestions,
    useAutocompleteProvider,
} from '@atlaskit/jql-editor-autocomplete-rest';

import {
    jqlFieldsMock,
    jqlFunctionsMock,
    jqlValuesMock,
    mockTeamAvatarUrl,
} from '../examples-utils/data';
import { Container } from '../examples-utils/styled';
import { type HydratedTeam, type HydratedValues, JQLEditor } from '../src';

// Mock team data for membersOf function arguments
const membersOfTeams = [
    {
        value: 'id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c',
        displayName: 'Spoonsteen staging',
    },
    {
        value: 'id: 229da7a2-bf93-4813-9e24-a6efbd2d445e',
        displayName: 'Atlas Teams Spoonsteen',
    },
    {
        value: 'id: 01f739be-5923-494c-9d77-803fccd7b51f',
        displayName: 'Spoonsteen interns',
    },
];

const getAutocompleteInitialData: GetAutocompleteInitialData = () =>
    // Simulate fetching initial data from an API
    new Promise((resolve) => {
        setTimeout(
            () =>
                resolve({
                    jqlFields: jqlFieldsMock,
                    jqlFunctions: jqlFunctionsMock,
                }),
            150,
        );
    });

const getAutocompleteSuggestions: GetAutocompleteSuggestions = () =>
    // Simulate fetching autocomplete suggestions from an API
    new Promise((resolve) => {
        setTimeout(
            () =>
                resolve({
                    results: jqlValuesMock,
                }),
            150,
        );
    });

const onHydrate = (jql: string): Promise<HydratedValues> => {
    // Simulate fetching hydrated team data from membersOf function arguments
    // Values are stored under the field name (e.g., 'assignee', 'reporter') just like regular team values
    const hydratedTeams = membersOfTeams
        .filter((team) => jql.includes(team.value))
        .map(
            (team): HydratedTeam => ({
                type: 'team',
                id: team.value,
                name: team.displayName,
                avatarUrl: mockTeamAvatarUrl,
            }),
        );

    return Promise.resolve({
        // Use the field name from the query (assignee, reporter, etc.)
        assignee: hydratedTeams,
        reporter: hydratedTeams,
    });
};

export default (): React.JSX.Element => {
    const autocompleteProvider = useAutocompleteProvider(
        'my-app',
        getAutocompleteInitialData,
        getAutocompleteSuggestions,
    );

    const onSearch = useCallback((jql: string) => {
        // Do some action on search
        console.log(jql);
    }, []);

    return (
        <Container>
            <JQLEditor
                analyticsSource={'my-app'}
                autocompleteProvider={autocompleteProvider}
                query={'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c")'}
                locale={'en'}
                onSearch={onSearch}
                enableRichInlineNodes
                onHydrate={onHydrate}
            />
        </Container>
    );
};
