import { v4 as uuidv4 } from 'uuid';

interface User {
	id: string;
	username: string;
	age: number;
	hobbies: string[];
};

const users: User[] = [];

export const getAllUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined =>
	users.find((user) => user.id === id);

export const createNewUser = (user: User): User => {
	const newUser = {...user, id: uuidv4()};
	users.push(newUser);
	return newUser;
};

export const deleteUser = (userId: string): boolean => {
	const index = users.findIndex(({ id }) => id === userId);
	if (index === -1) return false;

	users.splice(index, 1);
	return true;
};

export const updateUser = (userId: string, updatedUser: Partial<User>): User | null => {
	const index = users.findIndex(({ id }) => id === userId);
	if (index === -1) return null;

	users[index] = { ...users[index], ...updatedUser };
	return users[index];
};