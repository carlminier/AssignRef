public class TrainingVideo : TrainingVideoBase
    {
        public LookUp Category { get; set; }
        public BaseSeason Season { get; set; }
        public BaseConference Conference { get; set; }
        public string MediaUrl { get; set; }
        public bool IsPublished { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
    }

    public class VideoMain : LookUp
    {
        public LookUp Category { get; set; }
        public List <Video> Videos {get; set;}
    }
}


