import { Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface FeedWrapperProps {
	session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
	const router = useRouter();
	const { conversationId } = router.query;

	return (
		<Flex display={{ base: conversationId ? "flex" : "none" }} width="100%" direction="column">
			{conversationId ? <Flex>{conversationId}</Flex> : <Text>No Conversation Selected</Text>}
		</Flex>
	);
};

export default FeedWrapper;
