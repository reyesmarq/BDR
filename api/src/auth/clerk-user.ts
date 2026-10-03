export interface ClerkUser {
  /** Clerk user ID (JWT `sub` claim) — matches User.clerkId in the data model. */
  id: string;
  [claim: string]: unknown;
}
