using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Codeus.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Codeus
{
    [HubName("DocumentHub")]
    public class DocumentHub : Hub
    {
        public override Task OnConnected() {
            string id = Context.QueryString["Id"];
            SessionManager.JoinSession(id, Context.ConnectionId);
            Groups.Add(Context.ConnectionId, id);
            SignalRequestAll(id);
            return base.OnConnected();
        }
        public void SignalCreateDocument(string value) {
            Clients.OthersInGroup(Clients.Caller.GroupId).recieveCreateDocument(value);
        }
            
        public void SignalDeleteDocument(string document) {
            Clients.OthersInGroup(Clients.Caller.GroupId).recieveDeleteDocument(document);
        }

        public void SignalChangeDocument(string document, string value) {
            Clients.OthersInGroup(Clients.Caller.GroupId).RecieveChangeDocument(document, value);
        }

        public void SignalRequestAll(string id) {
            if (SessionManager.ActiveSessions[id].Count > 1) {
                Clients.Client(SessionManager.ActiveSessions[id][0]).recieveGetAll();
            }
        }

        public void SignalJoin(string id)
        {
            
        }

    }
}