using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Codeus.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            string session = Request.QueryString["Id"];
            if (session == null)
            {
                session = SessionManager.CreateSession();
                Response.Redirect($"?Id={session}");
            }
            ViewData["Id"] = session;
            return View();
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}