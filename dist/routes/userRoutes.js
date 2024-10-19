import { Message } from '../constants/messages.js';
let users = [];
export const handleUserRoutes = (request, response) => {
    const { method, url } = request;
    let bodyChunks = [];
    request.on('data', (chunk) => {
        bodyChunks.push(chunk);
    }).on('end', () => {
        const body = Buffer.concat(bodyChunks).toString();
        response.setHeader('Content-Type', 'application/json');
        if (url === '/api/users' && method === 'GET') {
            response.writeHead(200);
            response.end(JSON.stringify(users));
        }
        else if (url === '/api/users' && method === 'POST') {
            const user = JSON.parse(body);
            users.push(user);
            response.writeHead(201);
            response.end(JSON.stringify({ message: Message.UserAddedSuccessfully, user }));
        }
        else if (url?.match(/^\/api\/users\/[a-zA-Z0-9-]+$/) && method === 'GET') {
            const id = url.split('/')[3];
            users.find((user) => user.id === id);
            response.writeHead(200);
            response.end(JSON.stringify(users));
        }
        else if (url?.match(/^\/api\/users\/[a-zA-Z0-9-]+$/) && method === 'DELETE') {
            const id = url.split('/')[3];
            const index = users.findIndex((user) => user.id === id);
            users.splice(index, 1);
            response.writeHead(204);
            response.end(JSON.stringify({ message: Message.UserDeletedSuccesfully }));
        }
        // else if (url?.match(/^\/api\/users\/[a-zA-Z0-9-]+$/) && method === 'PUT') {}
        else {
            response.writeHead(404);
            response.end(JSON.stringify({ message: Message.RouteNotFound }));
        }
    });
};
