using IoTHubTrigger = Microsoft.Azure.WebJobs.EventHubTriggerAttribute;

using Microsoft.Azure.WebJobs;
using Microsoft.Azure.EventHubs;
using System.Text;
using System.Net.Http;
using Microsoft.Extensions.Logging;

namespace AttendanceTaker
{
    public static class ReceiveDeviceMessage
    {
        private static HttpClient client = new HttpClient();

        [FunctionName("ReceiveDeviceMessage")]
        public static void Run([IoTHubTrigger("messages/events", Connection = "IoTHubTriggerConnection")]EventData message, ILogger log)
        {
            log.LogInformation($"C# IoT Hub trigger function processed a message: {Encoding.UTF8.GetString(message.Body.Array)}");
        }
    }
}
