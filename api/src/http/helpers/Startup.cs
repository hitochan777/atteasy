using Microsoft.Azure.Cosmos.Fluent;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

using AttendanceTaking.infra;
using AttendanceTaking.domain;

[assembly: FunctionsStartup(typeof(AttendanceTaking.http.helpers.Startup))]
namespace AttendanceTaking.http.helpers
{
	class Startup : FunctionsStartup
	{
		public override void Configure(IFunctionsHostBuilder builder)
		{
			builder.Services.AddSingleton((service) =>
			{
				var connectionString = GetEnvironmentVariable("ConnectionStrings:CosmosDB");
				var cosmosClientBuilder = new CosmosClientBuilder(connectionString);
				return cosmosClientBuilder.Build();
			});
			builder.Services.AddLogging();
			builder.Services.AddSingleton<AttendanceRepository, CosmosDBAttendanceRepository>();
		}

		private static string GetEnvironmentVariable(string name)
		{
			return System.Environment.GetEnvironmentVariable(name, System.EnvironmentVariableTarget.Process);
		}

	}
}
