/**
 * Server components are good for statically rendered elements.
 * Important note: You cannot have a server component be a child of a client component.
 */

export default async function ServerExample() {
	const text = "I am a string!";
	return (
		<>
			{/**This empty <> is a fragment element unique to React.
          it lets us send multiple elements without them being in a parent div.
          it is optional */}
			<div className="border border-white">
				I am a Server Component!
				<p>{text}</p>
			</div>
		</>
	);
}
