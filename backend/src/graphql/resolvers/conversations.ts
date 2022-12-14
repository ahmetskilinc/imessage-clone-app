import { Prisma } from "@prisma/client";
import { ApolloError } from "apollo-server-core";
import { GraphQLContext } from "../../util/types";

const resolvers = {
	Query: {
		conversations: async (_: any, __: any, context: GraphQLContext) => {
			const { session, prisma } = context;

			console.log("conversations");
		},
	},
	Mutation: {
		createConversation: async (
			_: any,
			args: { participantIds: Array<string> },
			context: GraphQLContext
		): Promise<{ conversationId: String }> => {
			console.log("inside createConversation", args);

			const { session, prisma } = context;
			const { participantIds } = args;

			if (!session?.user) {
				throw new ApolloError("Not authorised");
			}

			const {
				user: { id: userId },
			} = session;

			try {
				const conversation = await prisma.conversation.create({
					data: {
						participants: {
							createMany: {
								data: participantIds.map((id) => ({
									userId: id,
									hasSeenLatestMessage: id === userId,
								})),
							},
						},
					},
					include: conversationPopulated,
				});

				return { conversationId: conversation.id };
			} catch (error: any) {
				throw new ApolloError(error?.message);
			}
		},
	},
};

export const participantPopulated = Prisma.validator<Prisma.ConversationParticipantInclude>()({
	user: {
		select: {
			id: true,
			username: true,
		},
	},
});

export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
	participants: {
		include: participantPopulated,
	},
	latestMessage: {
		include: {
			sender: {
				select: {
					id: true,
					username: true,
				},
			},
		},
	},
});

export default resolvers;
