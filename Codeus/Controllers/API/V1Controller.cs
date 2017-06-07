using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace Codeus.Controllers.API
{
    public class V1Controller : ApiController
    {
        [RequireHttps]
        public ActionResult Subscribe() {
            
            return null;
        }

        public ActionResult Login() {
            return null;
        }
    }
}
