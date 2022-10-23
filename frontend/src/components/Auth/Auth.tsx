import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import UserOperations from "../../graphql/operations/user";
import toast from "react-hot-toast";
import { CreateUsernameData, CreateUsernameVariables } from "../../util/types";

interface IAuthProps {
	session: Session | null;
	reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({ session, reloadSession }) => {
	const [username, setUsername] = useState("");
	const [createUsername, { loading, error }] = useMutation<
		CreateUsernameData,
		CreateUsernameVariables
	>(UserOperations.Mutations.createUsername);

	const onSubmit = async () => {
		if (!username) return;

		try {
			const { data } = await createUsername({
				variables: {
					username,
				},
			});

			if (!data?.createUsername) {
				throw new Error();
			}

			if (data.createUsername.error) {
				const {
					createUsername: { error },
				} = data;

				toast.error(error);
				return;
			}

			toast.success("Username successfully created");

			/**
			 * Reload session to obtain new username
			 */
			reloadSession();
		} catch (error) {
			toast.error("There was an error");
			console.log("onSubmit error", error);
		}
	};
	return (
		<Center height="100vh">
			<Stack align="center" spacing={8}>
				{session ? (
					<>
						<Text fontSize="3xl">Create a username: </Text>
						<Input
							placeholder="Enter a username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Button width="100%" onClick={() => onSubmit()} isLoading={loading}>
							Save
						</Button>
						<Button width="100%" onClick={() => signOut()}>
							Logout
						</Button>
					</>
				) : (
					<>
						<Text fontSize="3xl">iMessage Clone</Text>
						<Button
							onClick={() => signIn("google")}
							leftIcon={<Image height="20px" src="/logos/google.png" />}
						>
							Sign in With Google
						</Button>
						<Button
							onClick={() => signIn("github")}
							leftIcon={<Image height="20px" src="/logos/github.png" />}
						>
							Sign in With Github
						</Button>
					</>
				)}
			</Stack>
		</Center>
	);
};

export default Auth;
