import type { Booking, Client, Tour, User } from '../entities/entities.js';
export interface CrudRepository<T extends { [key: string]: unknown }> { list(): Promise<T[]>; get(id: number): Promise<T>; create(input: Partial<T>): Promise<T>; update(id: number, input: Partial<T>): Promise<T>; remove(id: number): Promise<void>; }
export interface UserRepository extends CrudRepository<User> { findByEmail(email: string): Promise<User | null>; }
export interface TourRepository extends CrudRepository<Tour> {}
export interface ClientRepository extends CrudRepository<Client> {}
export interface BookingRepository extends CrudRepository<Booking> {}
export interface AuthService { register(email: string, password: string, profile: Record<string, unknown>): Promise<unknown>; login(email: string, password: string): Promise<unknown>; verify(token: string): Promise<User>; resetPassword(email: string): Promise<void>; }
export interface ReportRepository { kpis(): Promise<unknown>; sales(from?: string, to?: string): Promise<unknown>; topTours(): Promise<unknown>; }