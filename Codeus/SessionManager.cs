using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Web;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Codeus
{
    public static class SessionManager
    {
        public static Dictionary<string, List<string>> ActiveSessions = new Dictionary<string, List<string>>();
        private const int max = 90;
        private const int min = 65;
        private static Random _random = new Random();
        public static string CreateSession()
        {
            string id = "";
            while (ActiveSessions.ContainsKey(id) || id == "")
            {
                id = GenerateRandomId();
            }
            ActiveSessions.Add(id, new List<string>());
            return id;
        }

        public static void JoinSession(string id, string connectionId)
        {
            if (ActiveSessions.ContainsKey(id))
            {
                ActiveSessions[id].Add(connectionId);
            }
        }

        public static void LeaveSession(string id, string connectionId) {
            if (ActiveSessions.ContainsKey(id)) {
                ActiveSessions[id].Remove(connectionId);
            }
        }



        private static string GenerateRandomId()
        {
            string id = "";
            for (int x = 0; x < 8; x++)
            {
                id += (char)_random.Next(min, max);
            }
            return id;
        }

    }
}