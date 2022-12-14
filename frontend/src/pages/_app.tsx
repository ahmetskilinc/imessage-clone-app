import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { client } from "../graphql/apollo-client";
import { theme } from "../chakra/theme";
import { Toaster } from "react-hot-toast";

function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps<{
	session: Session;
}>) {
	return (
		<ApolloProvider client={client}>
			<SessionProvider session={session}>
				<ChakraProvider theme={theme}>
					<Component {...pageProps} />
					<Toaster />
				</ChakraProvider>
			</SessionProvider>
		</ApolloProvider>
	);
}

export default MyApp;
