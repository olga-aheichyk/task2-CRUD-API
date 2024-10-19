import { createServer } from 'node:http';
import { handleUserRoutes } from './routes/userRoutes.js';
export const app = createServer((request, response) => {
    handleUserRoutes(request, response);
});
