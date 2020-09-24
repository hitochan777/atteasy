import useSWR, { mutate } from "swr";

import { Attendance, AttendanceType } from "./attendance";
import { fetcher } from "./fetcher";
import { useState } from "react";

export function useAttendances(
	userId: string | undefined,
	year: number,
	month: number
): { attendances?: Attendance[]; isLoading: boolean; isError: any } {
	const endpoint = `/api/${userId}/attendances?year=${year}&month=${month}`;
	const shouldFetch = !!userId;
	const { data, error } = useSWR<
		{ id: string; occurredAt: string; type: number }[]
	>(shouldFetch ? endpoint : null, fetcher);
	const attendances = data?.map(
		attendance =>
			new Attendance(
				attendance.id,
				new Date(attendance.occurredAt),
				attendance.type
			)
	);
	return {
		attendances,
		isLoading: shouldFetch && !error && !data,
		isError: error
	};
}

export function useDeleteAttendance(): {
	deleteAttendance: (
		userId: string | undefined,
		attendance: Attendance
	) => Promise<void>;
	loading: boolean;
	error: Error | null;
} {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const deleteAttendance = async (
		userId: string | undefined,
		attendance: Attendance
	) => {
		setLoading(true);
		const endpoint = `/api/${userId}/attendance/${attendance.id}`;
		try {
			await fetch(endpoint, {
				method: "DELETE"
			});
		} catch (e) {
			setError(e as Error);
		} finally {
			setLoading(false);
			mutate(
				`/api/${userId}/attendances?year=${attendance.occurredAt.getFullYear()}&month=${
					attendance.occurredAt.getMonth() + 1
				}`
			);
		}
	};
	return { deleteAttendance, loading, error };
}

export const useLogAttendance = (): {
	logAttendance: (
		userId: string,
		type: AttendanceType,
		occurredAt?: Date
	) => Promise<void>;
	loading: boolean;
	error: Error | null;
} => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const logAttendance = async (
		userId: string,
		type: AttendanceType,
		occurredAt?: Date
	) => {
		setLoading(true);
		const endpoint = `/api/${userId}/attendance`;
		try {
			const data: { type: string; occurredAt?: string } = {
				type: AttendanceType[type]
			};
			if (occurredAt) {
				data.occurredAt = occurredAt.toISOString();
			}
			await fetch(endpoint, {
				method: "POST",
				body: JSON.stringify(data),
				headers: { "content-type": "application/json" }
			});
		} catch (e) {
			setError(e as Error);
		} finally {
			setLoading(false);
		}
	};
	return { logAttendance, loading, error };
};
