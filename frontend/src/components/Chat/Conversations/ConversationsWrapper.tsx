import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationsList from "./ConversationsList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationsData } from "../../../util/types";

interface ConversationsWrapperProps {
	session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ session }) => {
	const {
		data: conversationsData,
		error: conversationsError,
		loading: conversationsLoading,
	} = useQuery<ConversationsData, null>(ConversationOperations.Queries.conversations);

	console.log("HERE IS DATA:", conversationsData);
	return (
		<Box width={{ base: " 100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
			{/* Skeleton Loader */}
			<ConversationsList session={session} />
		</Box>
	);
};

export default ConversationsWrapper;
