using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

using AttendanceTaking.http.helpers;
using AttendanceTaking.domain;

namespace AttendanceTaking.http.functions
{
	public class DeleteAttendance
	{
		private readonly AttendanceRepository attendanceRepository;
		public DeleteAttendance(AttendanceRepository attendanceRepository)
		{
			this.attendanceRepository = attendanceRepository;
		}

		[FunctionName("DeleteAttendance")]
		public async Task<IActionResult> Run(
			[HttpTrigger(AuthorizationLevel.Function, "delete", Route = "{userId}/attendance/{attendanceId}")] HttpRequest req,
			ILogger log, string userId, string attendanceId)
		{
			if (String.IsNullOrEmpty(userId) || String.IsNullOrEmpty(attendanceId))
			{
				return new BadRequestResult();
			}
			if (!req.isAuthorized(userId))
			{
				return new UnauthorizedResult();
			}
			var ok = await this.attendanceRepository.Delete(userId, attendanceId);
			return ok ? new OkResult() : new StatusCodeResult(StatusCodes.Status500InternalServerError);
		}
	}
}
