/**Files like this one are used to add more properties to existing
 * types/interfaces/classes that are imported from libraries */

declare global {
	namespace Express {
		interface Request {
			user?: User /**To be changed once we have an interface ready */;
		}
	}
}
