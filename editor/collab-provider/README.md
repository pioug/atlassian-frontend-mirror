# Integrating with Collab-Provider
This guide outlines two primary use cases for integrating with the collab-provider.

# Use Cases
1. Full Integration: FE Events and BE API Calls
    - For scenarios requiring both front-end events and back-end API interactions, the back-end APIs are hosted by `pf-collab-service`. To determine if API calls are necessary, please refer to the [OpenAPI documentation](https://bitbucket.org/atlassian/pf-collab-service/src/c25a7614f30c68cae50b8f8da827a844c4ccecc2/openapi.yaml#openapi.yaml), specifically under the `Service to Service` section.
2. Partial Integration: FE Events Only
    - For scenarios where only front-end events are needed, without back-end API interactions.

# Integration Details
1. Full Integration: FE Events and BE API Calls
    - Ensure the provider is initialized with:
        - `DocumentService` from `document-service.ts`
        - `Api` from `api.ts`
2. Partial Integration: FE Events Only
    - Ensure the provider is initialized with:
        - `NullDocumentService` from `null-document-service.ts`
        - `NullApi` from `null-api.ts`

For a detailed comparison of these integration approaches, refer to the source code in `../platform/packages/editor/collab-provider/src/provider/index.ts`.

# Support
If you have further questions or require assistance, please reach out to the [#team-cc-editor-services](https://atlassian.enterprise.slack.com/archives/C02GEULKMLN) on Slack.