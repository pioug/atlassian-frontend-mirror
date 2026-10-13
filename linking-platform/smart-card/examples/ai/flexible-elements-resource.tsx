import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Card } from '@atlaskit/smart-card/card/lazy';
import { CustomByStatusElement } from '@atlaskit/smart-card/custom-by-status-element';
import { CustomElementByAccessType as CustomByAccessTypeElement } from '@atlaskit/smart-card/custom-element-by-access-type';
import { CustomElementByAccessType } from '@atlaskit/smart-card/custom-element-by-access-type';
import { LatestCommitElement } from '@atlaskit/smart-card/flexible/latest-commit-element';
import { LinkIconElement } from '@atlaskit/smart-card/flexible/link-icon-element';
import { LocationElement } from '@atlaskit/smart-card/flexible/location-element';
import { PreviewElement } from '@atlaskit/smart-card/flexible/preview-element';
import { PriorityElement } from '@atlaskit/smart-card/flexible/priority-element';
import { ProgrammingLanguageElement } from '@atlaskit/smart-card/flexible/programming-language-element';
import { ProviderElement } from '@atlaskit/smart-card/flexible/provider-element';
import { ReadTimeElement } from '@atlaskit/smart-card/flexible/read-time-element';
import { SnippetElement } from '@atlaskit/smart-card/flexible/snippet-element';
import { SourceBranchElement } from '@atlaskit/smart-card/flexible/source-branch-element';
import { StateElement } from '@atlaskit/smart-card/flexible/state-element';
import { TargetBranchElement } from '@atlaskit/smart-card/flexible/target-branch-element';
import { TitleElement } from '@atlaskit/smart-card/flexible/title-element';

type ExampleProps = {
	/** The host supplies the Smart Link client and its permission-aware resolution behavior. */
	client: React.ComponentProps<typeof SmartCardProvider>['client'];
};

export default function FlexibleElementsExample({ client }: ExampleProps): React.JSX.Element {
	return (
		<SmartCardProvider client={client}>
			<Card appearance="block" url="https://example.atlassian.net/browse/ENG-1">
				<div>
					<LatestCommitElement />
					<LinkIconElement />
					<LocationElement />
					<PreviewElement />
					<PriorityElement />
					<ProgrammingLanguageElement />
					<ProviderElement />
					<ReadTimeElement />
					<SnippetElement />
					<SourceBranchElement />
					<StateElement />
					<TargetBranchElement />
					<TitleElement />
					<CustomByAccessTypeElement
						FORBIDDEN="Ask a site admin to review access"
						fallback="Access details unavailable"
					/>
					<CustomByStatusElement resolved="Resource is ready" />
					<CustomElementByAccessType fallback="Access details unavailable" />
				</div>
			</Card>
		</SmartCardProvider>
	);
}
