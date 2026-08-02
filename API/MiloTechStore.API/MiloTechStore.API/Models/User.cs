using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MiloTechStore.API.Models;

[Index("Username", Name = "UQ__Users__536C85E4FCA766B4", IsUnique = true)]
public partial class User
{
    [Key]
    public int Id { get; set; }

    [StringLength(150)]
    public string Username { get; set; } = null!;

    [StringLength(255)]
    public string PasswordHash { get; set; } = null!;

    public int RoleId { get; set; }

    [ForeignKey("RoleId")]
    [InverseProperty("Users")]
    public virtual Role Role { get; set; } = null!;
}
