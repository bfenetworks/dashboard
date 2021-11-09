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

echo "pack start"
rm  noahv/static/*/*.gz
cp version.txt noahv/
cp -r docs noahv/
cp -r README.md noahv/
mkdir output
mv noahv "bfe_dashboard_${version}"
mv "bfe_dashboard_${version}" output/
cd output
tar -czvf "bfe_dashboard_${version}.tar.gz" "bfe_dashboard_${version}"
shasum -a 256 "bfe_dashboard_${version}.tar.gz" > "bfe_dashboard_${version}_checksums.txt"
rm -rf "bfe_dashboard_${version}"
echo "pack success"

echo "build success"
exit 0;