import React from 'react';
import { md, Example, Props, code, AtlassianInternalWarning } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';
import { Code } from '@atlaskit/code';

export default md`
  ${(
		<SectionMessage appearance="error" title="@atlaskit/quick-search is deprecated">
			This package has been deprecated. Please use <Code>@atlassian/search-dialog</Code> instead.
		</SectionMessage>
	)}

	<br />

  ${(<AtlassianInternalWarning />)}

  This is a barebones quick-search component that can render different types of search results.

  ## Usage
  ${code`import { QuickSearch, ObjectResult, ContainerResult, ResultItemGroup } from '@atlaskit/quick-search';

  // Inside a react component with proper state and stuff.. :
  render() {
    return (
      <QuickSearch
        isLoading={this.state.isLoading}
        onSearchInput={({ target }) => { this.search(target.value); }}
        value={this.state.query}
      >
        // render search results:
        <ResultItemGroup title="Issues">
          <ObjectResult name="Fix this and that" objectKey="JRA-123" />
          <ObjectResult name="More stuff" objectKey="JRA-124" />
        </ResultItemGroup>
        <ResultItemGroup title="Spaces">
          <ContainerResult name="Search and Smarts" />
        </ResultItemGroup>
      </QuickSearch>
    );
  }
  `}

  ${(
		<Example
			Component={require('../examples/1-Object-Results').default}
			title="Objects"
			source={require('!!raw-loader!../examples/1-Object-Results')}
		/>
	)}

  ${(<Props props={require('!!extract-react-types-loader!../src/components/QuickSearch')} />)}

`;
