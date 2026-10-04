import { getCurrentUser } from "./api";
export async function requireUser() { return getCurrentUser(); }
