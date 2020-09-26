using System;
using System.ComponentModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;


namespace AttendanceTaking.domain
{
	[JsonObject(MemberSerialization.OptIn)]
	public class Attendance
	{
		[JsonProperty("id")] public string Id { get; set; }

		[JsonProperty("type")] public AttendanceType Type { get; set; }

		[JsonProperty("occurredAt")]
		public DateTimeOffset OccurredAt { get; set; }

		[JsonProperty("userId")] public string UserId { get; set; }

		public string GetDateString()
		{
			return OccurredAt.DateTime.Date.ToShortDateString();
		}
	}
}
