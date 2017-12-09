namespace sport_workouts_web_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migrationName : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Workouts", "ApplicationUserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Workouts", "ApplicationUserId");
            AddForeignKey("dbo.Workouts", "ApplicationUserId", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Workouts", "ApplicationUserId", "dbo.AspNetUsers");
            DropIndex("dbo.Workouts", new[] { "ApplicationUserId" });
            DropColumn("dbo.Workouts", "ApplicationUserId");
        }
    }
}
