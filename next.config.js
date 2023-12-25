/** @type {import('next').NextConfig} */
/* Config - https://stackoverflow.com/questions/67478532/module-not-found-cant-resolve-fs-nextjs/67478653#67478653 */
const nextConfig = {
    webpack(config) {
        config.resolve.fallback = {
          ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
            // by next.js will be dropped. Doesn't make much sense, but how it is
          fs: false, // the solution
        };
    
        return config;
    },
}

module.exports = nextConfig
