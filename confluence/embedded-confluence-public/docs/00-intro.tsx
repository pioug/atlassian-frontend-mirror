import { md } from '@atlaskit/docs';

export default md`
	## Introduction

	This package provides components (ViewPage, EditPage, and Page) to any 3rd party product that
	needs to embed a Confluence page into their products. It also offers the ability create an
	embedded page from inside a 3rd party product.

	## Quick Links

	- [Prerequisites and Installation Guide](/packages/confluence/embedded-confluence-public/docs/Prerequisites-and-installation)
	- [Components of Embedded Pages](/packages/confluence/embedded-confluence-public/docs/components-of-Embedded-Pages)
	- [Login/Authentication Flow](/packages/confluence/embedded-confluence-public/docs/Login-Flow)
	- [Create Embedded Page](/packages/confluence/embedded-confluence-public/docs/Create-Embedded-Page)
	- [Experience Tracker](/packages/confluence/embedded-confluence-public/docs/Experience-Tracker)
	- [API References](/packages/confluence/embedded-confluence-public/docs/API-References)

	### What are Embedded Pages?

	An embedded page (EP) is a Confluence page that can be integrated into any 3rd party product. It
	allows 3rd party product users to natively create/edit/view long-form page content within the same
	product context that they are working in. This promotes a “more powerful together” product
	experience and eliminates context-switching between the 3rd party product and Confluence.

	### Goals of Embedded Pages:

	_1. Deliver value and promote “better together” product experience_ - Allow 3rd party product
	users to easily create long form content and collaborate/share knowledge within the context of
	that 3rd party product, and thereby deriving value from this “windowed” experience.

	_2. Eliminate context switching_ - Rather than have users hop over to Confluence to
	create/edit/view content. We want to bring Confluence pages to you so that users can get started
	on pages wherever you are.

	### A note on limitations

	When a [Forge](https://developer.atlassian.com/platform/forge/) app uses embedded Confluence
	pages:

	1. Hyperlinks in the page will not work correctly.
	   [Learn more about hyperlinks in Forge](https://jira.atlassian.com/browse/ECO-205).
	2. The login flow for Embedded pages may encounter issues even after the user has granted storage
	   access.
	   - Forge apps operate within their own sandboxed (outer) iframe, and this outer iframe imposes
	     restrictions on pop-up windows for security reasons.
	     [Learn more about pop-up restrictions in Forge](https://ecosystem.atlassian.net/browse/ECOHELP-21573)
	   - Since pop-ups are necessary for the login page to function properly and enable users to log
	     in to their Atlassian account, the flow will be disrupted at this stage, potentially
	     preventing users from advancing further.
`;
