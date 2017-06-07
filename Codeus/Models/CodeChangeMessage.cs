using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;

namespace Codeus.Models
{
    public class CodeChangeMessage {

        public static class Types {
            public static int Remove = 0;
            public static int Change = 1;
        }

        public int Line;
        public int Type;
        public string Value;

        public CodeChangeMessage(int line, int type, string value) {
            Line = line;
            Type = type;
            Value = value;
        }
    }
}