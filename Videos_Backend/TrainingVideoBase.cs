using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.TrainingVideos
{
    public class TrainingVideoBase
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Subject { get; set; }
        public string ImageUrl { get; set; }
    }
}
