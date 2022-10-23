import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import { conversationPopulated, participantPopulated } from "../graphql/resolvers/conversations";

export interface Session {
	user?: User;
	expires: ISODateString;
}

export interface GraphQLContext {
	session: Session | null;
	prisma: PrismaClient;
	// pubsub
}

export interface User {
	id: string;
	username: string;
	emailVerified: boolean;
	email: string;
	image: string;
	name: string;
}

export interface CreateUsernameResponse {
	success?: boolean;
	error?: string;
}

export type ConversationPopulated = Prisma.ConversationGetPayload<{
	include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
	include: typeof participantPopulated;
}>;
