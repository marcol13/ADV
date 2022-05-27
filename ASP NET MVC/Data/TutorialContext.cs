using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tutorial.Models;

namespace Tutorial.Data
{
    public class TutorialContext : DbContext
    {
        public TutorialContext (DbContextOptions<TutorialContext> options)
            : base(options)
        {
        }

        public DbSet<Tutorial.Models.Movie> Movie { get; set; }
    }
}
