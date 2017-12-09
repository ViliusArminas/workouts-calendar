namespace sport_workouts_web_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migrationName2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Exercises", "ApplicationUserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Exercises", "ApplicationUserId");
            AddForeignKey("dbo.Exercises", "ApplicationUserId", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Exercises", "ApplicationUserId", "dbo.AspNetUsers");
            DropIndex("dbo.Exercises", new[] { "ApplicationUserId" });
            DropColumn("dbo.Exercises", "ApplicationUserId");
        }
    }
}
