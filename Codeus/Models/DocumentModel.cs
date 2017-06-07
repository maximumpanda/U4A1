using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codeus.Models
{
    public class DocumentModel
    {
        public string Name { get; set; }
        public List<string> Value { get; set; }
        public string ContainerId => Name + "-doc";

        public DocumentModel(string name)
        {
            Name = name;
            Value = new List<string>();
        }
    }
}