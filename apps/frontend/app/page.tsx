import ServerExample from "./components/exampleServer";
import ClientExample from "./components/exampleClient";

export default function Home() {
	return (
		<>
			This is the landing page for the TODO page
			<ServerExample />
			<ClientExample />
		</>
	);
}
