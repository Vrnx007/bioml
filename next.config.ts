import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Monorepo / multi-lockfile machines: pin tracing to this app (silences wrong-root warning).
  outputFileTracingRoot: path.join(process.cwd()),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pubchem.ncbi.nlm.nih.gov", pathname: "/**" },
      { protocol: "https", hostname: "www.ncbi.nlm.nih.gov", pathname: "/**" },
    ],
  },
};

export default withNextIntl(nextConfig);
