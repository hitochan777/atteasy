using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Xunit;

using AttendanceTaking.http.helpers;

namespace test
{
	public class StaticWebAppsAuthTest
	{
		[Fact]
		public void TestNonAnonymousUserIsAuthorized()
		{
			var clientPrincipal = new ClientPrincipal
			{
				IdentityProvider = "google",
				UserId = "foo",
				UserDetails = "foo bar",
				UserRoles = new List<string>
				{
					"anonymous",
					"user"
				}
			};
			var isAuthorized = StaticWebAppsAuth.IsAuthorized(clientPrincipal, "foo");
			Assert.True(isAuthorized);
		}

		[Fact]
		public void TestAnonymousUserIsNotAuthorized()
		{
			var clientPrincipal = new ClientPrincipal
			{
				IdentityProvider = "google",
				UserId = "foo",
				UserDetails = "foo bar",
				UserRoles = new List<string> { "anonymous", }
			};
			var isAuthorized = StaticWebAppsAuth.IsAuthorized(clientPrincipal, "foo");
			Assert.False(isAuthorized);
		}

		[Fact]
		public void TestNotAuthorizedToAccessResourceNotOwnedByTheAuthenticatedUser()
		{
			var clientPrincipal = new ClientPrincipal
			{
				IdentityProvider = "google",
				UserId = "bar",
				UserDetails = "foo bar",
				UserRoles = new List<string>
				{
					"anonymous",
					"user",
				}
			};
			var isAuthorized = StaticWebAppsAuth.IsAuthorized(clientPrincipal, "foo");
			Assert.False(isAuthorized);
		}
	}
}
