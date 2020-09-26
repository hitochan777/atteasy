using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using static System.String;

using AttendanceTaking.http.helpers;
using AttendanceTaking.domain;

namespace AttendanceTaking.http.functions
{
	public class GetAttendances
	{
		private readonly AttendanceRepository _attendanceRepository;
		public GetAttendances(AttendanceRepository attendanceRepository)
		{
			_attendanceRepository = attendanceRepository;
		}

		[FunctionName("GetAttendances")]
		public async Task<IActionResult> Run(
			[HttpTrigger(AuthorizationLevel.Function, "get", Route = "{userId}/attendances")] HttpRequest req,
			ILogger log, string userId)
		{
			if (IsNullOrEmpty(userId))
			{
				return new BadRequestResult();
			}
			if (req.isAuthorized(userId))
			{
				return new UnauthorizedResult();
			}


			var now = DateTimeOffset.UtcNow.AddHours(9);
			// If there are multiple matching query strings, take the first occurrence.
			var yearString = req.Query["year"].Count > 0 ? req.Query["year"].First() : $"{now.Year}";
			var monthString = req.Query["month"].Count > 0 ? req.Query["month"].First() : $"{now.Month}";

			int.TryParse(yearString, out var year);
			int.TryParse(monthString, out var month);

			var attendances = await _attendanceRepository.FindAll(userId, year, month);
			var responseMessage = JsonConvert.SerializeObject(attendances);
			return new OkObjectResult(responseMessage);
		}
	}
}
