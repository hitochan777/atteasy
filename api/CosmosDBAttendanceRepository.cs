using Microsoft.Azure.Cosmos;
using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Azure.Cosmos.Linq;
using System.Collections.Generic;

namespace AttendanceTaking.Infra.CosmosDB
{
	class CosmosDBAttendanceRepository : AttendanceRepository
	{
		private const string DatabaseName = "attendance";
		private const string AttendanceContainerName = "attendance";

		private readonly CosmosClient cosmosClient;
		private readonly Container container;

		public CosmosDBAttendanceRepository(CosmosClient _cosmosClient)
		{
			cosmosClient = _cosmosClient;
			container = cosmosClient.GetContainer(DatabaseName, AttendanceContainerName);
		}

		public async Task<Attendance[]> FindAll(string userId, int year, int month)
		{
			var result = new List<Attendance>();
			var start = new DateTimeOffset(new DateTime(year, month, 1), new TimeSpan(9, 0, 0));
			var end = new DateTimeOffset(new DateTime(year, month, 1), new TimeSpan(9, 0, 0)).AddMonths(1);
			var iterator = container.GetItemLinqQueryable<Attendance>().Where(attendance => attendance.UserId == userId && attendance.OccurredAt >= start && attendance.OccurredAt < end).ToFeedIterator();
			foreach (var item in await iterator.ReadNextAsync())
			{
				result.Add(item);
			}
			return result.ToArray();

		}

		public async Task<bool> Create(string userId, Attendance attendance)
		{
			return await Update(userId, attendance);
		}

		public async Task<bool> Update(string userId, Attendance attendance)
		{
			try
			{
				await container.UpsertItemAsync(new
				{
					id = generateId(),
					userId,
					occurredAt = attendance.OccurredAt,
					type = attendance.Type,
				});
				return true;
			}
			catch
			{
				return false;
			}
		}

		public async Task<bool> Delete(string userId, string attendanceId)
		{
			try
			{
				await container.DeleteItemAsync<Attendance>(attendanceId, new PartitionKey(userId));
				return true;
			}
			catch
			{
				return false;
			}
		}

		private string generateId()
		{
			return Guid.NewGuid().ToString();
		}
	}
}
