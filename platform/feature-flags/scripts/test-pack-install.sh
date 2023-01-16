#!/usr/bin/env bash

npm pack

package=$(ls -t *.tgz | head -1)

tmp_dir=$(mktemp -d)

cp $package $tmp_dir
cd $tmp_dir

mkdir dummy-project
cd dummy-project

npm init -y

# install the package and make sure it works
npm install ../$package

result=$?

cd /
#rm -rf $tmp_dir
echo $tmp_dir

exit $result
