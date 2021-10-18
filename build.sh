#!/bin/sh

version=`cat version.txt`
echo 'version: ' $version
sed -i "s/_VERSION_/$version/g" index.html
sed -i "s/_VERSION_/$version/g" src/main.js

CUR_DIR=$(cd `dirname $0`; pwd)

# prepare
if [ -d $CUR_DIR/output ]; then
    rm -rf $CUR_DIR/output
fi

if [ -d $CUR_DIR/noahv ]; then
    rm -rf $CUR_DIR/noahv
fi

echo "install node_module"
npm install --registry https://registry.npm.taobao.org

# build
echo "npm build start"

node configs/build.js

if [ $? -ne 0 ]; then
    echo "build failed!"
    exit 1;
fi
echo "npm build success"

mv noahv output
rm  output/static/*/*.gz
cp version.txt output/

echo "build success"
exit 0;
