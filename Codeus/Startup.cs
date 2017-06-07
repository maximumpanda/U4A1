using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Codeus.Startup))]
namespace Codeus
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.MapSignalR();
        }
    }
}
