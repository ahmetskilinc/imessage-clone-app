import { ApolloServer } from "apollo-server-express";
import {
	ApolloServerPluginDrainHttpServer,
	ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express from "express";
import { PrismaClient } from "@prisma/client";
import http from "http";
import typeDefs from "./graphql/typedefs";
import resolvers from "./graphql/resolvers";
import { makeExecutableSchema } from "@graphql-tools/schema";
import * as dotenv from "dotenv";
import { getSession } from "next-auth/react";
import { GraphQLContext, Session } from "./util/types";

async function main() {
	dotenv.config();
	const app = express();

	const httpServer = http.createServer(app);

	const prisma = new PrismaClient();

	const schema = makeExecutableSchema({
		typeDefs,
		resolvers,
	});

	const corsOptions = {
		origin: process.env.BASE_URL,
		credentials: true,
	};

	const server = new ApolloServer({
		schema,
		csrfPrevention: true,
		cache: "bounded",
		context: async ({ req, res }): Promise<GraphQLContext> => {
			const session = (await getSession({ req })) as Session;

			return { session, prisma };
		},
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			ApolloServerPluginLandingPageLocalDefault({ embed: true }),
		],
	});

	await server.start();
	server.applyMiddleware({
		app,
		cors: corsOptions,
	});

	await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

main().catch((error) => {
	console.log("Apollo Server error: ", error);
});
