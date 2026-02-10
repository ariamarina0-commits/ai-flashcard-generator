public class User
{
    public int Id{get; set;}
    public string Username{get; set;} = string.Empty;
    public string Email {get; set;} = string.Empty;
    public string PasswordHash {get; set;} = string.Empty;

    public List<FlashcardEntity> Flashcards {get; set;}= new();
}

public class FlashcardEntity
{
    public int Id{get; set;}
    public string Front {get; set;} = string.Empty;
    public string Back {get; set;} = string.Empty;
    public bool isMastered {get; set;}= false;

    public int UserId{get; set;}
}