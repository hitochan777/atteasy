using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace AttendanceTaking.http.helpers
{
	public class ClientPrincipal
	{
		public string IdentityProvider { get; set; }
		public string UserId { get; set; }
		public string UserDetails { get; set; }
		public IEnumerable<string> UserRoles { get; set; }

	}
	public static class StaticWebAppsAuth
	{
		public static ClaimsPrincipal CreateClaimPrincipal(ClientPrincipal principal)
		{
			if (!principal.UserRoles.Any())
			{
				return new ClaimsPrincipal();
			}
			principal.UserRoles = principal.UserRoles.Except(new string[] { "anonymous" }, StringComparer.CurrentCultureIgnoreCase);

			var identity = new ClaimsIdentity(principal.IdentityProvider);
			identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, principal.UserId));
			identity.AddClaim(new Claim(ClaimTypes.Name, principal.UserDetails));
			identity.AddClaims(principal.UserRoles.Select(r => new Claim(ClaimTypes.Role, r)));
			return new ClaimsPrincipal(identity);
		}

		public static ClientPrincipal GetClientPrincipal(HttpRequest req)
		{
			var header = req.Headers["x-ms-client-principal"];
			var data = header[0];
			var decoded = Convert.FromBase64String(data);
			var json = System.Text.ASCIIEncoding.ASCII.GetString(decoded);
			return JsonSerializer.Deserialize<ClientPrincipal>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
		}

		public static bool IsAuthorized(ClientPrincipal clientPrincipal, string targetUserId)
		{
			var principal = CreateClaimPrincipal(clientPrincipal);

			if (!principal.Identity.IsAuthenticated)
			{
				return false;
			}

			var loggedInUserId = principal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
			return loggedInUserId == targetUserId;
		}

	}
}
