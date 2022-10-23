import { User } from "@prisma/client";
import { ApolloError } from "apollo-server-core";
import { CreateUsernameResponse, GraphQLContext } from "../../util/types";

const resolvers = {
	Query: {
		searchUsers: async (
			_: any,
			args: { username: string },
			context: GraphQLContext
		): Promise<Array<User>> => {
			const { username: searchedUsername } = args;
			const { session, prisma } = context;

			if (!session?.user) {
				throw new ApolloError("Not authorised");
			}

			const {
				user: { username: myUsername },
			} = session;

			try {
				const users = await prisma.user.findMany({
					where: {
						username: {
							contains: searchedUsername,
							not: myUsername,
							mode: "insensitive",
						},
					},
				});

				return users;
			} catch (error: any) {
				console.log("searched users error");
				throw new ApolloError(error?.message);
			}
		},
	},
	Mutation: {
		createUsername: async (
			_: any,
			args: { username: string },
			context: GraphQLContext
		): Promise<CreateUsernameResponse> => {
			const { session, prisma } = context;

			if (!session?.user) {
				return {
					error: "Not authorised",
				};
			}

			const { id: userId } = session.user;
			const { username } = args;

			try {
				const existingUser = await prisma.user.findUnique({
					where: {
						username,
					},
				});

				if (existingUser) throw new Error("Username already exists. Try another.");

				await prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						username,
					},
				});

				return {
					success: true,
				};
			} catch (error: any) {
				console.log(error?.message);
				return {
					error: error?.message,
				};
			}
		},
	},
};

export default resolvers;
