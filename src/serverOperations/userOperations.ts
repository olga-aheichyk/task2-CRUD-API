import { IncomingMessage, ServerResponse } from 'node:http';
import { validate as isValidUUID } from 'uuid';
import { createNewUser, deleteUser, getAllUsers, getUserById, updateUser } from '../db/dbOperations.js';
import { Message } from '../constants/messages.js';

const parseRequestBody = async (request: IncomingMessage): Promise<any> => {
	return new Promise((resolve, reject) => {
		let bodyChunks: Buffer[] = [];

		request.on('data', (chunk: Buffer): void => {
			bodyChunks.push(chunk);
		}).on('end', () => {
			const body: string = Buffer.concat(bodyChunks).toString();

			try {
				resolve(JSON.parse(body));
			}

			catch {
				reject();
			}
		});
	});
};

export const getAllUsersFromServer = (response: ServerResponse): void => {
	try {
		const users = getAllUsers();

		response.writeHead(200);
		response.end(JSON.stringify(users));
	}

	catch {
		response.writeHead(500);
		response.end(JSON.stringify({ message: Message.SmthWentWrongError }));
	}
};

export const getUserByIdFromServer = (id: string, response: ServerResponse) => {
	try {
		if (!isValidUUID(id)) {
			response.writeHead(400);
			response.end(JSON.stringify({ message: Message.WrongUserIdError }));
			return;
		}

		const user = getUserById(id);

		if (!user) {
			response.writeHead(404);
			response.end(JSON.stringify({ message: Message.UserNotFoundError }));
			return;
		}


		response.writeHead(200);
		response.end(JSON.stringify({ user }));
	}

	catch {
		response.writeHead(500);
		response.end(JSON.stringify({ message: Message.SmthWentWrongError }));
	}
};

export const createNewUserOnServer = async (request: IncomingMessage, response: ServerResponse) => {
	try {
		const user = await parseRequestBody(request);
		const { username, age, hobbies } = user;

		if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
			response.writeHead(400);
			response.end(JSON.stringify({ message: Message.UserValidationError }));
			return;
		}

		const newUser = createNewUser(user);

		response.writeHead(201);
		response.end(JSON.stringify({ message: Message.UserAddedSuccessfully, user: newUser }));
	}

	catch {
		response.writeHead(500);
		response.end(JSON.stringify({ message: Message.SmthWentWrongError }));
	}
};

export const deleteUserFromServer = (id: string, response: ServerResponse) => {
	try {
		if (!isValidUUID(id)) {
			response.writeHead(400);
			response.end(JSON.stringify({ message: Message.WrongUserIdError }));
			return;
		}

		const isDeleted = deleteUser(id);

		if (!isDeleted) {
			response.writeHead(404);
			response.end(JSON.stringify({ message: Message.UserNotFoundError }));
			return;
		}


		response.writeHead(204);
		response.end(JSON.stringify({ message: Message.UserDeletedSuccesfully}));
	}

	catch {
		response.writeHead(500);
		response.end(JSON.stringify({ message: Message.SmthWentWrongError }));
	}
};

export const updateUserOnServer = async (userId: string, request: IncomingMessage, response: ServerResponse) => {
	try {
		if (!isValidUUID(userId)) {
			response.writeHead(400);
			response.end(JSON.stringify({ message: Message.WrongUserIdError }));
			return;
		}

		const user = await parseRequestBody(request);
		const { username, age, hobbies } = user;

		type UpdateData = {
			username?: string;
			age?: number;
			hobbies?: string[];
			[key: string]: string | number | string[] | undefined;
		};

		const updateData: UpdateData = { username, age, hobbies };

		const filteredData = Object.keys(updateData).reduce((acc: Record<string, any>, key) => {
			if (updateData[key] !== undefined) {
				acc[key] = updateData[key];
			}
			return acc;
		}, {});

		const updatedUser = updateUser(userId, filteredData);

		if (updatedUser) {
			response.writeHead(200);
			response.end(JSON.stringify({ message: Message.UserUpdatedSuccesfully, user: updatedUser }));
			return;
		}

		response.writeHead(404);
		response.end(JSON.stringify({ message: Message.UserNotFoundError }));
	}

	catch {
		response.writeHead(500);
		response.end(JSON.stringify({ message: Message.SmthWentWrongError }));
	}
}