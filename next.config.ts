import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['alipay-sdk', 'wechatpay-node-v3', 'formidable'],
};

export default nextConfig;
