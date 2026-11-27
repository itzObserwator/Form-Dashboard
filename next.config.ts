import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";
const networkHosts = Object.values(networkInterfaces()).flatMap((interfaces) =>
  (interfaces || []).filter((address) => !address.internal && address.family === "IPv4").map((address) => address.address),
);
const nextConfig: NextConfig = {
  allowedDevOrigins: networkHosts,
  devIndicators: false,
  turbopack: { root: process.cwd() },
};
export default nextConfig;
