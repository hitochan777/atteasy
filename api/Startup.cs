using AttendanceTaking.Infra.CosmosDB;
using Microsoft.Azure.Cosmos.Fluent;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(AttendanceTaking.Startup))]
namespace AttendanceTaking
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

        public static string GetEnvironmentVariable(string name)
        {
            return System.Environment.GetEnvironmentVariable(name, System.EnvironmentVariableTarget.Process);
        }

    }
}
