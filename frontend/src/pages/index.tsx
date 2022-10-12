import { Box } from "@chakra-ui/react";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { Auth } from "../components/Auth";
import { Chat } from "../components/Chat";

const Home: NextPage = () => {
	const { data: session } = useSession();

	const reloadSession = () => {};

	return (
		<Box>
			<div>
				{session?.user.username ? (
					<Chat />
				) : (
					<Auth session={session} reloadSession={reloadSession} />
				)}
			</div>
		</Box>
	);
};

export async function getServerSideProps(context: NextPageContext) {
	const session = await getSession(context);

	return {
		props: {
			session,
		},
	};
}

export default Home;

/**
 *
 */
