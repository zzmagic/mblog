/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains:['img4.mukewang.com']
  }
 
}

module.exports = removeImports(nextConfig);
