using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace AttendanceTaking.http.helpers
{
	public static class HttpRequestExtension
	{
		public static bool isAuthorized(this HttpRequest req, string userId)
		{
			return true;
			/*
			var claimsPrincipal = StaticWebAppsAuth.GetClaimsPrincipal(req);
			if (!claimsPrincipal.Identity.IsAuthenticated)
			{
				return false;
			}

			var loggedInUserId = claimsPrincipal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
			return loggedInUserId == userId;
			*/
		}
	}
}
