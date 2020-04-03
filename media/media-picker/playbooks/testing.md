# Testing

## Table of contents

- [Unit testing](#markdown-header-unit-testing)
- [Popup](#markdown-header-popup)
  - [Functional smoke testing](#markdown-header-functional-smoke-testing)
  - [Full functional testing](#markdown-header-full-functional-testing)

## Unit testing

Check coverage in `./coverage/lcov-report` directory. Coverage is generated automatically on running `yarn test`.

If it's not getting mapped properly (you'll spot that immediately), clean up webpact and ts artifacts.

## Popup

### Functional smoke testing

Testing is carried out locally on the Popup example. As a general rule,
to be performed **before** PR is opened or during peer review process.

1. Local uploads
   1. Upload multiple small files (<10 MB) from your local machine via **drag and drop** and **browse** button
   2. Upload multiple large files (> 200 MB) from your local machine via **drag and drop** or **browse** button. Ensure that:
      - emitted events do not contain any errors,
      - files can be retrieved in **recent** browser,
      - no visual artefacts or issues (browser lag/crashes).
2. Abort an upload by reloading the page. Ensure that:
   - file can be reuploaded,
   - cancellation is handled by **recent** browser properly.
3. Ensure that in **cloud upload**:
   - users are able to authenticate an application (google drive or dropbox) and revoke authentication
   - users can copy files from their cloud storages to their collection and then to application's collection

### Full functional testing

In addition to smoke testing test cases. To be performed after major architectural changes which involve changes to
interfaces between components. Data should be extended with large files and a large number of files as well.

4. Ensure that:
   - Media editor functions as it should: adds annotations, saves a new file on Save, cancels the progress on Cancel
   - **teardown** function works
     - should remove popup iframe from the dom
   - throttling the network doesn't cause advese effects
