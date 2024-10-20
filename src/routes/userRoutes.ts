import { IncomingMessage, ServerResponse } from 'node:http';
import { Message } from '../constants/messages.js';
import { createNewUserOnServer, deleteUserFromServer, getAllUsersFromServer, getUserByIdFromServer, updateUserOnServer } from '../serverOperations/userOperations.js';

export const handleUserRoutes = (request: IncomingMessage, response: ServerResponse): void => {
	const { method, url } = request;

	response.setHeader('Content-Type', 'application/json');

	if (url === '/api/users' && method === 'GET') {
		getAllUsersFromServer(response);
	}

	else if (url === '/api/users' && method === 'POST') {
		createNewUserOnServer(request, response);
	}

	else if (url?.match(/^\/api\/users\/[a-zA-Z0-9-]+$/) && method === 'GET') {
		const id = url.split('/')[3];
		getUserByIdFromServer(id, response);
	}

	else if (url?.match(/^\/api\/users\/[a-zA-Z0-9-]+$/) && method === 'DELETE') {
		const id = url.split('/')[3];
		deleteUserFromServer(id, response);
	}

	else if (url?.match(/^\/api\/users\/[a-zA-Z0-9-]+$/) && method === 'PUT') {
		const id = url.split('/')[3];
		updateUserOnServer(id, request, response);
	}

	else {
		response.writeHead(404);
		response.end(JSON.stringify({ message: Message.NotFoundError }));
	}
}