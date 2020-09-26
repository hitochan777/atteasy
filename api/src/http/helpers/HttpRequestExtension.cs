using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace AttendanceTaking.http.helpers
{
	public static class HttpRequestExtension
	{
		public static bool isAuthorized(this HttpRequest req, string userId)
		{
			var principal = StaticWebAppsAuth.GetClientPrincipal(req);
			return StaticWebAppsAuth.IsAuthorized(principal, userId);
		}
	}
}
