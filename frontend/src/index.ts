export default {
    async fetch(request, env, ctx) {
        // If the ASSETS binding is available (configured in wrangler.json), serve the asset
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }
        return new Response("Leaf Detection Worker Running (No Assets Binding)", {
            headers: { "content-type": "text/plain" },
        });
    },
};
