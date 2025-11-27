"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

type User = {
	UUID: string;
	username: string;
	email?: string;
	firstName?: string;
	lastName?: string;
};

type UserContextType = {
	user: User | null;
	isLoading: boolean;
	login: (userData: User) => void;
	logout: () => void;
	refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const refreshUser = async () => {
		try {
			const res = await fetch("http://localhost:3001/auth/session", {
				credentials: "include",
			});

			if (res.ok) {
				const data = await res.json();
				console.log(data);
				setUser(data.user);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("Error fetching user session:", error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		refreshUser();
	}, []);

	const login = (userData: User) => {
		setUser(userData);
	};
	const logout = async () => {
		try {
			await fetch("http://localhost:3001/auth/signout", {
				method: "POST",
				credentials: "include",
			});
		} catch (error) {
			console.error("Error during logout:", error);
		} finally {
			setUser(null);
		}
	};

	return (
		<UserContext.Provider
			value={{ user, isLoading, login, logout, refreshUser }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);

	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
