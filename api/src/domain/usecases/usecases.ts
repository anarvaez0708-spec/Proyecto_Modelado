import type { AuthService, BookingRepository, ClientRepository, CrudRepository, ReportRepository, TourRepository, UserRepository } from '../repositories/repositories.js';
import type { Booking, Client, Tour, User } from '../entities/entities.js';
export const crud = <T extends { [key: string]: unknown }>(repo: CrudRepository<T>) => ({ list: () => repo.list(), get: (id: number) => repo.get(id), create: (input: Partial<T>) => repo.create(input), update: (id: number, input: Partial<T>) => repo.update(id, input), remove: (id: number) => repo.remove(id) });
export class LoginUser { constructor(private auth: AuthService) {} execute(email: string, password: string) { return this.auth.login(email, password); } }
export class RegisterUser { constructor(private auth: AuthService) {} execute(email: string, password: string, profile: Record<string, unknown>) { return this.auth.register(email, password, profile); } }
export class GetUserFromToken { constructor(private auth: AuthService) {} execute(token: string) { return this.auth.verify(token); } }
export class Reports { constructor(private repo: ReportRepository) {} kpis() { return this.repo.kpis(); } sales(from?: string, to?: string) { return this.repo.sales(from, to); } topTours() { return this.repo.topTours(); } }
export type Repositories = { users: UserRepository; tours: TourRepository; clients: ClientRepository; bookings: BookingRepository; reports: ReportRepository };
export type ApiEntities = { User: User; Tour: Tour; Client: Client; Booking: Booking };