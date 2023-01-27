# InProductTestingSample

Product mock that imports Atlaskit's Cypress tests

Example test:

```
import { editorFundamentalsTestCollection } from '@atlaskit/editor-common/in-product';

//code to navigate to the page

editorFundamentalsTestCollection({}).test(cy);

```

Run the example tests with the following command:

`bolt test:cypress:watch -e BOT_USERNAME=<STG_USERNAME>,BOT_PASSWORD=<STG_PASSWORD>`
