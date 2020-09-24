using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;


namespace AttendanceTaking
{
    class UserInfo
    {
        public bool IsAuthenticated = false;
        public string UserId;
    }
    class Authorizer
    {
        ILogger logger;
        public Authorizer(ILogger logger)
        {
            this.logger = logger;
        }
        public UserInfo GetUser(HttpRequest req)
        {
            var principalString = req.Headers["x-ms-client-principal"];
            logger.LogInformation($"principal string: {principalString}");
            return new UserInfo
            {
                IsAuthenticated = true,
                UserId = "hitochan"
            };
        }
    }
}
