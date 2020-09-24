using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Security.Claims;

namespace AttendanceTaking
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
			/*
			var claimsPrincipal = StaticWebAppsAuth.GetClaimsPrincipal(req);
			if (claimsPrincipal.Identity.IsAuthenticated)
			{
				return new ForbidResult();
			}
			if (claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier).Value != userId)
			{
				return new UnauthorizedResult();
			}
			*/
			if (String.IsNullOrEmpty(userId))
			{
				return new BadRequestResult();
			}

			int year, month;

			var now = DateTimeOffset.UtcNow.AddHours(9);
			// If there are multiple matching querystrings, take the first occurrence.
			string yearString = req.Query["year"].Count > 0 ? req.Query["year"].First() : $"{now.Year}";
			string monthString = req.Query["month"].Count > 0 ? req.Query["month"].First() : $"{now.Month}";


			int.TryParse(yearString, out year);
			int.TryParse(monthString, out month);

			var attendances = await _attendanceRepository.FindAll(userId, year, month);
			string responseMessage = JsonConvert.SerializeObject(attendances);
			return new OkObjectResult(responseMessage);
		}
	}
}
