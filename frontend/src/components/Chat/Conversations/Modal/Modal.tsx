import { useLazyQuery, useMutation } from "@apollo/client";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import UserOperations from "../../../../graphql/operations/user";
import ConversationOperations from "../../../../graphql/operations/conversation";
import {
	CreateConversationData,
	CreateConversationInput,
	SearchedUser,
	SearchUsersData,
	SearchUsersInput,
} from "../../../../util/types";
import Participants from "./Participants";
import UserSearchList from "./UserSearchList";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	session: Session;
}

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose, session }) => {
	const {
		user: { id: userId },
	} = session;
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
	const [searchUsers, { data, error, loading: searchUsersLoading }] = useLazyQuery<
		SearchUsersData,
		SearchUsersInput
	>(UserOperations.Queries.searchUsers);

	const [createConversation, { loading: createConversationLoading }] = useMutation<
		CreateConversationData,
		CreateConversationInput
	>(ConversationOperations.Mutations.createConversation);

	const onSearch = (e: React.FormEvent) => {
		e.preventDefault();
		searchUsers({ variables: { username } });
	};

	const onCreateConversation = async () => {
		const participantIds = [userId, ...participants.map((p) => p.id)];
		try {
			const { data } = await createConversation({ variables: { participantIds } });

			if (!data?.createConversation) throw new Error("Failed to create conversation");
			else {
				const {
					createConversation: { conversationId },
				} = data;
				router.push({ query: { conversationId } });

				setParticipants([]);
				setUsername("");
				onClose();
			}
		} catch (error: any) {
			console.log("onCreateConversaion Error:", error?.message);
			toast(error?.message);
		}
	};

	const addParticipant = (user: SearchedUser) => {
		setParticipants((prev) => [...prev, user]);
	};

	const removeParticipant = (userId: string) => {
		setParticipants((prev) => prev.filter((p) => p.id !== userId));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent bg="#2d2d2d" pb={4}>
				<ModalHeader>Create a Conversation</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<form onSubmit={onSearch}>
						<Stack spacing={4}>
							<Input
								placeholder="Enter a username"
								value={username}
								onChange={(e) => {
									setUsername(e.target.value);
								}}
							/>
							{error && <Text>{error.message}</Text>}
							<Button
								type="submit"
								disabled={!username}
								isLoading={searchUsersLoading}
							>
								Search
							</Button>
						</Stack>
					</form>
					{data?.searchUsers && (
						<UserSearchList users={data?.searchUsers} addParticipant={addParticipant} />
					)}
					{participants.length !== 0 && (
						<>
							<Participants
								participants={participants}
								removeParticipant={removeParticipant}
							/>
							<Button
								bg="brand.100"
								width="100%"
								mt={6}
								_hover={{ bg: "brand.100" }}
								isLoading={createConversationLoading}
								onClick={onCreateConversation}
							>
								Create Conversation
							</Button>
						</>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ConversationModal;
