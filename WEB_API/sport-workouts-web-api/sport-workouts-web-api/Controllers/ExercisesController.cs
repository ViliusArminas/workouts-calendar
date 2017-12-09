using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using sport_workouts_web_api.Classes;
using sport_workouts_web_api.Models;
using System.Web.Http.Cors;
using AutoMapper;

namespace sport_workouts_web_api.Controllers
{
    [Authorize]
    [EnableCorsAttribute("http://localhost:4200", "*", "*")]
    public class ExercisesController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Exercises
        [Route("api/exer/list/{id}")]
        public List<ExercisesGetDto> GetExercises(string id)
        {
            var list = db.Exercises.Where(i => i.ApplicationUserId == id).ToList();

            var resList = new List<ExercisesGetDto>();
            var result = AutoMapper.Mapper.Map<List<ExercisesGetDto>>(list);
            return result;
        }

        // GET: exercises by muscle group ID
        [Route("api/exer/{groupId}")]
        public List<ExercisesGetDto> GetExercisesByMuscleGroup(int groupId)
        {
            var list = db.Exercises.ToList();

            var resList = new List<ExercisesGetDto>();
            var result = AutoMapper.Mapper.Map<List<ExercisesGetDto>>(list);

            var filteredList = new List<ExercisesGetDto>();

            foreach (var i in result)
            {
                ICollection<MuscleGroupsGetDto> lst = i.MuscleGroups;
                foreach (var j in lst)
                {
                    if (j.MuscleGroupId == groupId)
                        filteredList.Add(i);
                }
            }

            return filteredList;
        }

        // POST: api/Exercises
        [ResponseType(typeof(ExercisesGetDto))]
        [Route("api/exer")]
         public IHttpActionResult PostExercise(ExercisePostDto exercise)
         {
             if (!ModelState.IsValid)
             {
                 return BadRequest(ModelState);
             }

            var insertItem = AutoMapper.Mapper.Map<Exercise>(exercise);
            var muscleGroups = db.MuscleGroups.ToList();
            var exerciseMuscleGroups = new List<MuscleGroup>();
            foreach (var i in exercise.MuscleGroups)
            {
                exerciseMuscleGroups.Add(muscleGroups.Single(a => a.MuscleGroupId == i.MuscleGroupId));
            }
            insertItem.MuscleGroups = exerciseMuscleGroups;


            db.Exercises.Add(insertItem);
             db.SaveChanges();

            var exerciseDto = AutoMapper.Mapper.Map<ExercisesGetDto>(insertItem);

            return Ok(exerciseDto);
        }

        // PUT: api/Exercises/5
        //[ResponseType(typeof(void))]
  
        public IHttpActionResult PutExercise(int id, ExerciseUpdateDto exercise)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != exercise.ExerciseId)
            {
                return BadRequest();
            }

            var exer = db.Exercises.Find(id);
            AutoMapper.Mapper.Map(exercise, exer);

            // Making list of musclegroups ids got from dto
            var exerciseMuscleGroupsIdList = new List<int>();

            foreach (var i in exercise.MuscleGroups)
            {
                exerciseMuscleGroupsIdList.Add(i.MuscleGroupId);
            }

            // Checking if musclegroup existed in current exercise, if not, remove it
            foreach (var i in exer.MuscleGroups.ToList())
            {
                if (!exerciseMuscleGroupsIdList.Contains(i.MuscleGroupId))
                exer.MuscleGroups.Remove(i);
            }

            // Cheking if muscle group exists in database and adds it to workout if it does
            foreach (var i in exercise.MuscleGroups)
            {
                if (!exer.MuscleGroups.Any(r => r.MuscleGroupId == i.MuscleGroupId))
                {
                    var addMuscleGroup = db.MuscleGroups.Find(i.MuscleGroupId);
                    exer.MuscleGroups.Add(addMuscleGroup);
                }
            }
       

                try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExerciseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            var updatedExer = db.Exercises.Find(id);
            ExercisesGetDto result = AutoMapper.Mapper.Map<ExercisesGetDto>(updatedExer);
            return Ok(result);
        }

        // DELETE: api/Exercises/5
        //[ResponseType(typeof(Exercise))]
        [Route("api/exer/delete/{id}")]
        public IHttpActionResult DeleteExercise(int id)
        {
            Exercise exercise = db.Exercises.Find(id);

            if (db.Workouts.Any(f => f.Exercises.Any(e => e.ExerciseId == id)))
            {
                return new System.Web.Http.Results.ResponseMessageResult(
        Request.CreateErrorResponse((HttpStatusCode)410,
            new HttpError("Exercise cannot be deleted, because it is used in one of workouts!")));
            }


            if (exercise == null)
            {
                return NotFound();
            }

            db.Exercises.Remove(exercise);
            db.SaveChanges();
            string result = "Deleted exercise with id = " + id;
            return Ok(result);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ExerciseExists(int id)
        {
            return db.Exercises.Count(e => e.ExerciseId == id) > 0;
        }
    }
}