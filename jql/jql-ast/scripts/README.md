# Scripts

## Performance

Performance script takes a CSV file containing JQL queries as input and produces a CSV output with parsing performance measurements for each query.

1. Copy `valid-queries.example.csv` to `valid-queries.csv`
2. Populate `valid-queries.csv` with the queries you wish to analyze (see [this page](https://hello.atlassian.net/wiki/spaces/JFE/pages/804119660/JQL+Editor+-+Testing+valid+user+queries#Getting-user-queries-from-Splunk)
for details on how to extract user queries from Splunk)
3. `yarn global add ts-node`
4. `ts-node performance.ts`
5. See output in the `output` directory

You can analyze the output using the Jupyter notebook included in this directory (`performance.ipynb`) for some quick numbers and distribution charts. To do that, you can either open the file with an IDE that supports Jupyter (e.g. PyCharm) or follow the instructions on [Jupyter site](https://jupyter.org/install) and enjoy an evening with `pip`.
