import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { SupabaseAuthService, UsersRepository, ToursRepository, ClientsRepository, BookingsRepository, ReportsRepository } from './data/repositories/supabaseRepositories.js';
import { buildRoutes } from './presentation/routes/routes.js';
import { errorHandler } from './presentation/middlewares/http.js';
const app = express();
const auth = new SupabaseAuthService();
app.use(cors({
	origin: (origin, callback) => {
		const isLocalFlutterOrigin = !origin || /^https?:\/\/localhost(:\d+)?$/.test(origin);
		const isConfiguredOrigin = env.CORS_ORIGIN === '*' || origin === env.CORS_ORIGIN;
		callback(null, isLocalFlutterOrigin || isConfiguredOrigin);
	},
}));
app.use(express.json());
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'artetours-api' }));
app.use(buildRoutes({ auth, users: new UsersRepository(), tours: new ToursRepository(), clients: new ClientsRepository(), bookings: new BookingsRepository(), reports: new ReportsRepository() }));
app.use(errorHandler);
app.listen(env.PORT, () => console.log(`Arte Tours API listening on port ${env.PORT}`));