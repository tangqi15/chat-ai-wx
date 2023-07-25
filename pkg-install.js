const fs = require('fs-extra');
const path = require('path');

const basePath = {
  from: 'node_modules',
  to: 'src/wxcomponents',
};

const pkgList = [{
  from: './@vant/weapp/dist',
  to: './vant/dist',
}];

const copy = (base, pkg) => {
  const from = `${path.join(__dirname, base.from)}/${pkg.from}`;
  const to = `${path.join(__dirname, base.to)}/${pkg.to}`;
  fs.copySync(from, to);
};

pkgList.forEach((pkg) => {
  copy(basePath, pkg);
});
