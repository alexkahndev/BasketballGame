const contentTypes = {
	"/": "text/html",
	"/index.html": "text/html",
	".png": "image/png",
	".jpg": "image/jpg",
	".svg": "image/svg+xml",
	".css": "text/css",
	".js": "application/x-javascript",
	".wasm": "application/wasm",
	".json": "application/json",
	".xml": "application/xml",
	".hdr": "image/vnd.radiance",
	".glb": "model/gltf-binary",
};

const server = Bun.serve({
	port: 8080,
	fetch(req, server) {
		if (server.upgrade(req)) {
			return undefined;
		}

		const url = new URL(req.url);
		let response;
		const contentType =
			contentTypes[
				url.pathname.endsWith("/")
					? "/"
					: url.pathname.slice(url.pathname.lastIndexOf("."))
			];

		if (contentType) {
			response = new Response(
				Bun.file(
					import.meta.dir +
						(url.pathname.endsWith("/") ? "/index.html" : url.pathname),
				),
				{
					headers: { "Content-Type": contentType },
				},
			);
		} else {
			response = new Response("Not found", { status: 404 });
		}

		return response;
	},
	websocket: {
		async message(ws, message) {
			console.log(`Received ${message}`);
			ws.send(`You said: ${message}`);
		},
	},
});

console.log(`Server running at http://${server.hostname}:${server.port}/`);
