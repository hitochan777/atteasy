using System.Threading.Tasks;

namespace AttendanceTaking.domain
{
	public interface AttendanceRepository
	{
		public Task<Attendance[]> FindAll(string userId, int year, int month);
		public Task<bool> Create(string userId, Attendance attendance);

		public Task<bool> Update(string userId, Attendance attendance);
		public Task<bool> Delete(string userId, string attendanceId);

	}
}
