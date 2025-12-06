interface Env {
    ASSETS?: {
        fetch: (request: Request) => Promise<Response>;
    };
}

export default {
    async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
        // If the ASSETS binding is available (configured in wrangler.json), serve the asset
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }
        return new Response("Leaf Detection Worker Running (No Assets Binding)", {
            headers: { "content-type": "text/plain" },
        });
    },
};
