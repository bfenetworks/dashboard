/**
 * @file config for proxy, useful only in dev.
 *
 * The dev server is using http-proxy-middleware for proxying,
 * so you can refer to its docs for detailed usage.
 * see https://github.com/chimurai/http-proxy-middleware for documentation.
 */
// eslint-disable-next-line no-undef
module.exports = {
    proxy: {
        // proxy all requests starting with /proxy to target,
        // use ** or / will proxy all requests starting with any string，include static file.
        // proxy useful only while path exist && option.target is exist
        path: ['/open-api/v1'],
        option: {
            target: 'http://127.0.0.1:8183',
            // changes the origin of the host header to the target URL
            changeOrigin: true,
            // object, adds request headers. (Example: {Cookie:'mycookie'})
            headers: {
                // if target url need auth
                // get cookie by visit the target url
                Cookie: false
            }
        }
    }
};
