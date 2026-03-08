import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Server {
    id: bigint;
    ip: string;
    subcategory: string;
    name: string;
    tags: Array<string>;
    category: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllServers(): Promise<Array<Server>>;
    getCallerUserRole(): Promise<UserRole>;
    getServersByCategory(category: string): Promise<Array<Server>>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    searchServers(searchText: string): Promise<Array<Server>>;
}
