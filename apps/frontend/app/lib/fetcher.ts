export function getFetcher(url: string) {
	fetch(url, {
		method: "GET",
		credentials: "include",
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Error ${res.status}: ${res.statusText}`);
		}
		return res.json();
	});
}

export function postFetcher(url: string) {
	fetch(url, {
		method: "POST",
		credentials: "include",
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Error ${res.status}: ${res.statusText}`);
		}
		return res.json();
	});
}
