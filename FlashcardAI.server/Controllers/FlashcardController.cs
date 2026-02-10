using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Google.GenAI;
using FlashcardAI.Server.Models;
using System.Text.Json;

namespace FlashcardAI.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowReactApp")]
public class FlashcardController : ControllerBase
{
    private readonly string _apiKey;

    public FlashcardController(IConfiguration configuration)
    {
        // This pulls the key from the "User Secrets"
        _apiKey = configuration["Gemini:ApiKey"] ?? throw new ArgumentNullException("API Key missing");
    }

    [HttpPost("generate")]
    public async Task<ActionResult<List<Flashcard>>> GenerateCards([FromBody] StudyRequest request)
    {
        var client = new Client(apiKey: _apiKey);
        string studyMaterial = request.Text;
        
        // The Prompt: We tell Gemini exactly what structure we want
        string prompt = $@"
            Extract 5 key study concepts from the text below. 
            Return the result ONLY as a valid JSON array of objects.
            Each object must have 'front' and 'back' properties.
            Text: {studyMaterial}";
      
        try 
        {
            var response = await client.Models.GenerateContentAsync("gemini-2.5-flash", prompt);
            var jsonString = response.Candidates?[0]?.Content?.Parts?[0]?.Text 
                 ?? throw new Exception("The AI returned an empty or blocked response.");

            jsonString = jsonString.Replace("```json", "").Replace("```", "").Trim();

            var flashcards = JsonSerializer.Deserialize<List<Flashcard>>(jsonString, new JsonSerializerOptions 
            { 
            PropertyNameCaseInsensitive = true 
            });

            return Ok(flashcards);
        }
        catch (Exception ex)
        {
            return BadRequest($"AI Generation failed: {ex.Message}");
        }
    }
}

public class StudyRequest
{
    public string Text { get; set; } = string.Empty;
}