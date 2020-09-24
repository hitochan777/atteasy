using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace AttendanceTaking
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
            var ok = await this.attendanceRepository.Delete(userId, attendanceId);
            if (!ok)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new OkResult();
        }
    }
}
